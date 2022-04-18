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
    sigma = int(round(0.3 * ((k_size - 1) * 0.5 - 1) + 0.8))
    kernel = cv2.getGaussianKernel(k_size, sigma)
    return cv2.filter2D(in_image, -1, kernel, borderType=cv2.BORDER_REPLICATE)


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
    # blur = blurImage2(img, np.array([3, 3]))
    blur = blurImage2(img, 3)
    return edgeDetectionZeroCrossingSimple(blur)


def edgeDetectionCanny(img: np.ndarray, thrs_1: float, thrs_2: float) -> (np.ndarray, np.ndarray):
    """
    Detecting edges usint "Canny Edge" method
    :param img: Input image
    :param thrs_1: T1
    :param thrs_2: T2
    :return: opencv solution, my implementation
    """
    opencv = cv2.Canny((img*255).astype(np.uint8), img.shape[0], img.shape[1])

    if img.max() > 2:
        img = img / 255
    # get answer from sobel and normalize
    G_x = cv2.Sobel(img, cv2.CV_64F, 1, 0, ksize=3)
    G_y = cv2.Sobel(img, cv2.CV_64F, 0, 1, ksize=3)
    img = ((G_x ** 2) + (G_y ** 2)) ** 0.5

    # get directions from 0 to 180 and Quantize to 4 values
    directions = (np.arctan2(G_x, G_y) * 180) / np.pi
    directions %= 180
    directions[(directions >= 0) & (directions < 22.5)] = 0
    directions[(directions >= 157.5) & (directions < 180)] = 0
    directions[(directions >= 22.5) & (directions < 67.5)] = 45
    directions[(directions >= 67.5) & (directions < 112.5)] = 90
    directions[(directions >= 112.5) & (directions < 157.5)] = 135

    # NMS
    for i in range(1, img.shape[0] - 1):
        for j in range(1, img.shape[1] - 1):
            nei_l = 0
            nei_r = 0
            if directions[i, j] == 0:
                nei_l = img[i - 1, j]
                nei_r = img[i + 1, j]
            elif directions[i, j] == 45:
                nei_l = img[i - 1, j - 1]
                nei_r = img[i + 1, j + 1]
            elif directions[i, j] == 90:
                nei_l = img[i, j - 1]
                nei_r = img[i, j + 1]
            elif directions[i, j] == 135:
                nei_l = img[i - 1, j + 1]
                nei_r = img[i + 1, j - 1]
            if (img[i, j] < nei_l) | (img[i, j] < nei_r):
                img[i, j] = 0
    # value of 1 to pixels that are greater then T1
    # and 0 to pixels that smaller then T2
    img[img >= thrs_1] = 1
    img[img <= thrs_2] = 0
    # if the pixel value is greater then T2 and smaller then T1 mark by value 3.
    img[(thrs_2 < img) & (img < thrs_1)] = 3

    for i in range(1, img.shape[0] - 1):
        for j in range(1, img.shape[1] - 1):
            if img[i, j] == 3:
                #  if the pixel value is 3 check if one of his neighbors is 1
                if 1 in img[i - 1:i + 2, j - 1:j + 2]:
                    img[i, j] = 1
                else:
                    img[i, j] = 0
    # if there is any left marks change to 0. (usually at borders)
    img[img == 3] = 0
    img = (img * 255).astype(np.uint8)
    return opencv, img


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
    rows = img.shape[0]
    cols = img.shape[1]

    img, _ = edgeDetectionCanny(img, 0.75, 0.2)
    radius = range(min_radius, max_radius)
    circles = []
    threshold = 160
    for r in radius:
        print('radius: ', r)
        acc = np.zeros(img.shape)
        # Make accumulator
        for i in range(rows):
            for j in range(cols):
                if img[i, j] == 255:
                    for angle in range(360):
                        b = j - round(np.sin(angle * np.pi / 180) * r)
                        a = i - round(np.cos(angle * np.pi / 180) * r)
                        if 0 <= a < rows and 0 <= b < cols:
                            acc[a, b] += 1

        if acc.max() > threshold:
            acc[acc < threshold] = 0
            # find the circles for this radius
            for i in range(1, rows - 1):
                for j in range(1, cols - 1):
                    if acc[i, j] >= threshold:
                        avg_sum = acc[i - 1:i + 2, j - 1:j + 2].sum() / 9
                        if avg_sum >= threshold / 9:
                            # checking that the distance from every circle to the current circle
                            # is more than the radius
                            if all((i - xc) ** 2 + (j - yc) ** 2 > rc ** 2 for xc, yc, rc in circles):
                                circles.append((i, j, r))
                                acc[i - r:i + r, j - r:j + r] = 0
    return circles
