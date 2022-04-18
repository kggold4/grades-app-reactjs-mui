import numpy as np
import cv2


def conv1D(in_signal: np.ndarray, k_size: np.ndarray) -> np.ndarray:
    """
    Convolve a 1-D array with a given kernel
    :param in_signal: 1-D array
    :param k_size: 1-D array as a kernel
    :return: The convolved array
    """
    kernel_len = len(k_size)
    inSignal = np.pad(k_size, (kernel_len - 1, kernel_len - 1), )
    signal_len = len(inSignal)
    conv = np.zeros(signal_len - kernel_len + 1)
    for i in range(len(conv)):
        conv[i] = (inSignal[i:i + len(k_size)] * k_size).sum()
    return conv


def conv2D(in_image: np.ndarray, kernel: np.ndarray) -> np.ndarray:
    """
    Convolve a 2-D array with a given kernel
    :param in_image: 2D image
    :param kernel: A kernel
    :return: The convolved image
    """
    kernel2 = np.flip(kernel)
    heightKer, widthKer = kernel2.shape
    heightImg, widthImg = in_image.shape
    image_padded = np.pad(in_image, (heightKer // 2, widthKer // 2), 'edge')
    convImg = np.zeros((heightImg, widthImg))
    for i in range(heightImg):
        for j in range(widthImg):
            convImg[i, j] = (image_padded[i:i + heightKer, j:j + widthKer] * kernel2).sum()
    return convImg


def convDerivative(in_image: np.ndarray) -> (np.ndarray, np.ndarray):
    """
    Calculate gradient of an image
    :param in_image: Grayscale image
    :return: (directions, magnitude)
    """
    kernel1 = np.array([[0, 0, 0], [-1, 0, 1], [0, 0, 0]])
    kernel2 = kernel1.transpose()
    x_der = conv2D(in_image, kernel1)
    y_der = conv2D(in_image, kernel2)
    directrions = np.arctan(y_der, x_der)
    mangitude = np.sqrt(np.square(x_der) + np.square(y_der))

    # return directrions, mangitude, x_der, y_der
    return directrions, mangitude


def createGaussianKer(kernel_size, sigma):
    center = int(kernel_size / 2)
    kernel = np.zeros((kernel_size, kernel_size))
    for i in range(kernel_size):
        for j in range(kernel_size):
            diff = np.sqrt((i - center) ** 2 + (j - center) ** 2)
            kernel[i, j] = np.exp(-(diff ** 2) / (2 * sigma ** 2))
    return kernel / np.sum(kernel)


def blurImage1(in_image: np.ndarray, k_size: int) -> np.ndarray:
    """
    Blur an image using a Gaussian kernel
    :param in_image: Input image
    :param k_size: Kernel size
    :return: The Blurred image
    """
    sigma = int(round(0.3 * ((k_size - 1) * 0.5 - 1) + 0.8))
    kernel = createGaussianKer(k_size, sigma)
    return conv2D(in_image, kernel)


def blurImage2(in_image: np.ndarray, k_size: int) -> np.ndarray:
    """
    Blur an image using a Gaussian kernel using OpenCV built-in functions
    :param in_image: Input image
    :param k_size: Kernel size
    :return: The Blurred image
    """
    sigma = 0.3 * ((k_size - 1) * 0.5 - 1) + 0.8
    guassian = cv2.getGaussianKernel(ksize=k_size, sigma=sigma)
    guassian = guassian * guassian.transpose()
    return cv2.filter2D(in_image, -1, guassian, borderType=cv2.BORDER_REPLICATE)


def edgeDetectionZeroCrossingSimple(img: np.ndarray) -> np.ndarray:
    """
    Detecting edges using "ZeroCrossing" method
    :param img: Input image
    :return: Edge matrix
    """
    width = img.shape[1]
    height = img.shape[0]
    lapKernel = np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]])
    # Smooth with 2D Gaussian
    img = conv2D(img, lapKernel)
    logImage = np.zeros(img.shape)
    for i in range(height - (lapKernel.shape[0] - 1)):
        for j in range(width - (lapKernel.shape[1] - 1)):
            if img[i, j] == 0:
                # check all neighbors
                if (img[i - 1][j] < 0 and img[i + 1][j] > 0) or \
                        (img[i - 1][j] > 0 and img[i + 1][j] < 0) or \
                        (img[i][j - 1] < 0 and img[i][j + 1] > 0) or \
                        (img[i][j - 1] < 0 and img[i][j + 1] < 0):
                    logImage[i][j] = 255
            if img[i, j] < 0:
                if (img[i - 1][j] > 0) or (img[i + 1][j] > 0) or (img[i][j - 1] > 0) or (img[i][j + 1] > 0):
                    logImage[i][j] = 255
    return logImage


def edgeDetectionZeroCrossingLOG(img: np.ndarray) -> np.ndarray:
    """
    Detecting edges using "ZeroCrossingLOG" method
    :param img: Input image
    :return: Edge matrix
    """
    blur = blurImage2(img, np.array([3, 3]))
    return edgeDetectionZeroCrossingSimple(blur)


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
    # use this sorce: https://github.com/PavanGJ/Circle-Hough-Transform/blob/master/main.py
    #  Use the Canny Edge detector as the edge detector
    height, width = img.shape
    img = cv2.GaussianBlur(img, (5, 5), 0)
    img = cv2.Canny(img, 50, 100)
    # detect all edges
    edges = np.argwhere(img > 0)
    # Initializing accumulator array.
    # Accumulator array is a 3 dimensional array with the dimensions representing
    # the radius, X  and Y coordinate .
    # Also appending a padding of 2 times R_max to overcome the problems of overflow
    A = np.zeros((max_radius, height + 2 * max_radius, width + 2 * max_radius))
    # Precomputing all angles
    theta = np.arange(0, 360) * np.pi / 180
    for r in range(round(min_radius), round(max_radius)):
        # Creating a Circle Blueprint
        bprint = np.zeros((2 * (r + 1), 2 * (r + 1)))
        (m, n) = (r + 1, r + 1)  # center of blueprint
        for angle in theta:
            x = int(np.round(r * np.cos(angle)))
            y = int(np.round(r * np.sin(angle)))
            bprint[m + x, n + y] = 1
        constant = np.argwhere(bprint).shape[0]
        for x, y in edges:  # For each edge coordinates
            # Centering the blueprint circle over the edges
            # and updating the accumulator array
            # X = [x - m + max_radius, x + m + max_radius]  # Computing the extreme X values
            # Y = [y - n + max_radius, y + n + max_radius]  # Computing the extreme Y values
            A[r, x - m + max_radius: x + m + max_radius, y - n + max_radius: y + n + max_radius] += bprint
        threshold = 7
        A[r][A[r] < threshold * constant / r] = 0
    # size to detect peaks
    region = 15
    B = np.zeros((max_radius, height + 2 * max_radius, width + 2 * max_radius))
    # extracting the  circles detected
    for r, x, y in np.argwhere(A):
        temp = A[r - region:r + region, x - region:x + region, y - region:y + region]
        p, a, b = np.unravel_index(np.argmax(temp), temp.shape)
        B[r + (p - region), x + (a - region), y + (b - region)] = 1
    circles = np.argwhere(B[:, max_radius:-max_radius, max_radius:-max_radius])
    return circles


def bilateral_filter_implement(in_image: np.ndarray, k_size: int, sigma_color: float, sigma_space: float) -> (
        np.ndarray, np.ndarray):
    """
    :param in_image: input image
    :param k_size: Kernel size
    :param sigma_color: represents the filter sigma in the color space.
    :param sigma_space: represents the filter sigma in the coordinate.
    :return: OpenCV implementation, my implementation
    """

    return
