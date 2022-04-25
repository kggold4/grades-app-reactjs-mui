import numpy as np
import cv2
import math

BASE_KERNEL_DERV = [[0, 0, 0], [-1, 0, 1], [0, 0, 0]]
LAPLACIAN_KERNEL = np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]])
KERNEL_5 = (5, 5)
IMAGE_PIXELS_SIZE = 255
STEPS = 100
SIZE_THRESH_RATIO = 0.47
PI = np.pi


def conv1D(in_signal: np.ndarray, k_size: np.ndarray) -> np.ndarray:
    """
    Convolve a 1-D array with a given kernel
    :param in_signal: 1-D array
    :param k_size: 1-D array as a kernel
    :return: The convolved array
    """
    kernel_size = len(k_size)
    signal = np.pad(k_size, (kernel_size - 1, kernel_size - 1), )
    signal_size = len(signal)
    conv = np.zeros(signal_size - kernel_size + 1)
    k = 0
    while k < len(conv):
        conv[k] = (signal[k:k + kernel_size] * k_size).sum()
        k += 1
    return conv


def conv2D(in_image: np.ndarray, kernel: np.ndarray) -> np.ndarray:
    """
    Convolve a 2-D array with a given kernel
    :param in_image: 2D image
    :param kernel: A kernel
    :return: The convolved image
    """
    flipped_kernel = np.flip(kernel)
    kernel_height, kernel_width = flipped_kernel.shape
    image_height, image_width = in_image.shape
    image_padded = np.pad(in_image, (kernel_height // 2, kernel_width // 2), "edge")
    image_conv = np.zeros((image_height, image_width))
    i = 0
    while i < image_height:
        j = 0
        while j < image_width:
            image_conv[i, j] = (image_padded[i:i + kernel_height, j:j + kernel_width] * flipped_kernel).sum()
            j += 1
        i += 1
    return image_conv


def convDerivative(in_image: np.ndarray) -> (np.ndarray, np.ndarray):
    """
    Calculate gradient of an image
    :param in_image: Grayscale image
    :return: (directions, magnitude)
    """
    kernel = np.array(BASE_KERNEL_DERV)
    transposed_kernel = kernel.transpose()
    x_der, y_der = conv2D(in_image, kernel), conv2D(in_image, transposed_kernel)
    directrions = np.arctan(y_der, x_der)
    mangitude = np.sqrt(np.square(x_der) + np.square(y_der))
    return directrions, mangitude


def my_create_gaussian(k_size: int, sigma: float):
    mid = k_size // 2
    kernel = np.zeros((k_size, k_size))
    i = 0
    while i < k_size:
        j = 0
        while j < k_size:
            x = i - mid
            y = j - mid
            kernel[i, j] = np.exp(-(x ** 2 + y ** 2) / (2 * sigma ** 2)) / (2 * PI * sigma ** 2)
            j += 1
        i += 1
    return kernel


def get_sigma_blur_image(k_size: int) -> float:
    return 0.3 * ((k_size - 1) * 0.5 - 1) + 0.8


def blurImage1(in_image: np.ndarray, k_size: int) -> np.ndarray:
    """
    Blur an image using a Gaussian kernel
    :param in_image: Input image
    :param k_size: Kernel size
    :return: The Blurred image
    """
    return conv2D(in_image, my_create_gaussian(k_size=k_size, sigma=get_sigma_blur_image(k_size=k_size)))


def blurImage2(in_image: np.ndarray, k_size: int) -> np.ndarray:
    """
    Blur an image using a Gaussian kernel using OpenCV built-in functions
    :param in_image: Input image
    :param k_size: Kernel size
    :return: The Blurred image
    """
    kernel = cv2.getGaussianKernel(k_size, int(round(get_sigma_blur_image(k_size))))
    return cv2.filter2D(in_image, -1, kernel, borderType=cv2.BORDER_REPLICATE)


def edgeDetectionZeroCrossingSimple(img: np.ndarray) -> np.ndarray:
    """
    Detecting edges using "ZeroCrossing" method
    :param img: Input image
    :return: Edge matrix
    """
    img = conv2D(img, LAPLACIAN_KERNEL)
    zero_crossing = np.zeros(img.shape)
    for i in range(img.shape[0] - (LAPLACIAN_KERNEL.shape[0] - 1)):
        for j in range(img.shape[1] - (LAPLACIAN_KERNEL.shape[1] - 1)):
            if img[i][j] == 0:
                if (img[i][j - 1] < 0 and img[i][j + 1] > 0) or (img[i][j - 1] < 0 and img[i][j + 1] < 0) or (
                        img[i - 1][j] < 0 and img[i + 1][j] > 0) or (img[i - 1][j] > 0 and img[i + 1][j] < 0):
                    zero_crossing[i][j] = IMAGE_PIXELS_SIZE
            if img[i][j] < 0 and (img[i][j - 1] > 0) or (img[i][j + 1] > 0) or (img[i - 1][j] > 0) or (
                    img[i + 1][j] > 0):
                zero_crossing[i][j] = IMAGE_PIXELS_SIZE
    return zero_crossing


def edgeDetectionZeroCrossingLOG(img: np.ndarray) -> np.ndarray:
    """
    Detecting edges using "ZeroCrossingLOG" method
    :param img: Input image
    :return: Edge matrix
    """
    # blur = blurImage2(img, np.array([3, 3]))
    # blur = blurImage2(img, 3)
    # return edgeDetectionZeroCrossingSimple(blur)
    img = cv2.GaussianBlur(img, KERNEL_5, 0)
    return edgeDetectionZeroCrossingSimple(img)


def houghCircle(img: np.ndarray, min_radius: int, max_radius: int) -> list:
    """
    Find Circles in an image using a Hough Transform algorithm extension
    To find Edges you can Use OpenCV function: cv2.Canny
    :param img: Input image
    :param min_radius: Minimum circle radius
    :param max_radius: Maximum circle radius
    :return: A list containing the detected circles,
                [(x,y,radius),(x,y,radius),...]
    """
    edges = cv2.Canny((img * IMAGE_PIXELS_SIZE).astype(np.uint8), STEPS, 200) / IMAGE_PIXELS_SIZE
    edges_points_arrays = np.where(edges > 0)
    edges_points = list(zip(*edges_points_arrays))
    votes = {}
    for y, x in edges_points:
        for r in range(min_radius, max_radius):
            # for every theta
            for step in range(STEPS):
                theta = 360 * step / STEPS
                a, b = int(x + r * np.cos(np.deg2rad(theta))), int(y + r * np.sin(np.deg2rad(theta)))
                if a < img.shape[0] and b < img.shape[1]:
                    if (a, b, r) in votes:
                        votes[(a, b, r)] = votes.get((a, b, r)) + 1
                    else:
                        votes[(a, b, r)] = 1
    max_centers = []
    sorted_centers = sorted(
        [filter(lambda k: votes[k] > STEPS * SIZE_THRESH_RATIO, votes)], key=lambda k: votes[k], reverse=True)
    for center in sorted_centers:
        a, b, r = center
        if all((a - a_max) ** 2 + (b - b_max) ** 2 > r_max ** 2 for a_max, b_max, r_max in max_centers):
            max_centers.append(center)
    return max_centers


def bilateral_filter_implement(in_image: np.ndarray, k_size: int, sigma_color: float, sigma_space: float) -> (
        np.ndarray, np.ndarray):
    """
    :param in_image: input image
    :param k_size: Kernel size
    :param sigma_color: represents the filter sigma in the color space.
    :param sigma_space: represents the filter sigma in the coordinate.
    :return: OpenCV implementation, my implementation
    """
    cv_image = cv2.bilateralFilter(in_image, k_size, sigma_color, sigma_space)
    shape = in_image.shape
    row, col = shape[0], shape[1]
    row_arr, col_arr = np.arange(0, row, 1).astype(int), np.arange(0, col, 1).astype(int)
    pad = math.floor(k_size / 2)
    padded_image = cv2.copyMakeBorder(in_image, pad, pad, pad, pad, cv2.BORDER_REPLICATE, None, value=0)
    image_new = np.zeros(shape)
    gaus = cv2.getGaussianKernel(k_size, k_size)
    gaus = gaus.dot(gaus.T)
    for i in row_arr:
        for j in col_arr:
            neighbor_hood = padded_image[i:i + k_size, j:j + k_size]
            diff_gau = np.exp(-np.power(in_image[i, j] - neighbor_hood, 2) / (2 * sigma_color))
            combo = gaus * diff_gau
            result = combo * neighbor_hood / combo.sum()
            image_new[i][j] = result.sum()
    return cv_image, image_new
