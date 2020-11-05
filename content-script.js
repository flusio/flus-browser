function removeNoExtensionElements() {
    let elementsToRemove = document.querySelectorAll('.no-extension');
    for (element of elementsToRemove) {
        element.remove();
    }
}

document.addEventListener('turbolinks:load', removeNoExtensionElements);
removeNoExtensionElements();
