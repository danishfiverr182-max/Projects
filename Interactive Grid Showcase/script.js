let heading = document.getElementById("h1");
let btn = document.getElementById("changeColor");

function changeColor(){
    let color = prompt("Enter a Color Name");
    if(color){
        document.body.style.backgroundColor=color;
    }
}
btn.addEventListener('click',changeColor);