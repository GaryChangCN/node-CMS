var rem = function() {
    var setRem = function() {
        var width = document.documentElement.clientWidth ? document.documentElement.clientWidth : window.innerWidth;
        width = width > 1450 ? 1450 : width;
        var rem = width / 10;
        document.querySelector("html").style.fontSize = rem + "px";
    }
    setRem();
    window.addEventListener("resize", function() {
        setRem();
    });
}
export default rem;