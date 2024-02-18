// FOR THIS CODE TO WORK, YOU MUST ACTUALLY BE ON IMGUR.COM
const settings = {
    url: 'CHANGE TO YOUR PUBLIC GALLERY URL', // URL of the imgur gallery. Example: https://imgur.com/gallery/exampleurl
    imageOnly: true, // If you only require the image URLs and do not need the descriptions, set this to true.
    easyCopy: true // Logs the URLs to the console in a format that is easy to copy. This only works when 'imageOnly' is set to true.
}

const getImgurImages = async (imgurUrl) => {
    const urlRegex = /^https:\/\/imgur\.com\/gallery\/[a-zA-Z0-9]+$/
    if (!imgurUrl.match(urlRegex)) {
        console.log('Gallery URL does not match the required format. Please check the example.')
        console.log('Example: https://imgur.com/gallery/exampleurl')
        return;
    }

    const parser = new DOMParser();
    const request = await fetch(imgurUrl, {method: 'POST'});
    const response = await request.text()
    const parsedResponse = parser.parseFromString(response, 'text/html');
    const imageContainers = parsedResponse.querySelectorAll('.post-images .post-image-container')
    if (Array.from(imageContainers)?.length) {

        const imageDetailsArr = Array.from(imageContainers).map(imageContainer => {
            const imageUrl = imageContainer.querySelector('[itemprop="thumbnailUrl"]')?.content;
            const imageDescriptionText = imageContainer.querySelector('.post-image-description')?.innerText;
            return {imageUrl, imageDescriptionText}
        })

        if (settings.imageOnly) {
            if (settings.easyCopy) {
                let resultString = '';
                imageDetailsArr.forEach(imageDetail => resultString += `${imageDetail.imageUrl}\n`)
                console.log(resultString)
            } else {
                console.log(imageDetailsArr.map(imageDetail => imageDetail.imageUrl))
            }
        } else {
            console.log(imageDetailsArr)
        }

    } else {
        console.log(`
        Failed to get any images.
        Please ensure you are on imgur.com for this code to function correctly.
        If you believe this is an error, please report it by opening an issue in the GitHub repository.
        `)
    }
}

getImgurImages(settings.url).then(r => r);