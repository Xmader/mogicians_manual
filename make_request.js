const make_XHR_request = (url, callback, error_text) => {
    httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                callback(httpRequest.responseText);
            } else {
                console.error(error_text, httpRequest)
            }
        }
    };

    httpRequest.open('GET', url, true);
    httpRequest.send();
}

const make_fetch_request = (url, callback, error_text) => {
    fetch(url)
        .then((response) => {
            if (!response.ok) throw response;
            return response.text()
        })
        .then((text) => callback(text))
        .catch((error_response) => console.error(error_text, error_response))
}

const make_get_request = (typeof fetch != "undefined") ? make_fetch_request : make_XHR_request

export default make_get_request
