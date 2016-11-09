function getCategory() {
    let category = document.getElementById("category").value.toString()
    let subCategory = document.getElementById("subCategory")
    var option = document.createElement("option");
    if (category.toString() == "Graphics") {
        option.text = "Photography"
    }
}
