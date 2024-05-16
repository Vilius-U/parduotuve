var descriptionElements = document.querySelectorAll('.description');

// Loop through each description element
descriptionElements.forEach(function(descriptionElement) {

  var pElementToRemove = descriptionElement.querySelector("p");

  if (pElementToRemove) {
    // Remove the p element from the div
    descriptionElement.removeChild(pElementToRemove);
}

    // Get all li elements within the description
    var liElements = descriptionElement.querySelectorAll("li");

    // Check if there are more than three li elements
    if (liElements.length > 3) {
        // Remove excess li elements beyond the first three
        for (var i = 3; i < liElements.length; i++) {
            liElements[i].parentNode.removeChild(liElements[i]);
        }
    }
});