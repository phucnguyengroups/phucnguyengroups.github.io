// Hàm set cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

// Hàm get cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
    }
    return null;
}

// Tự động điền username & token khi trang load
window.onload = function () {
    const username = getCookie("gh-username");
    const token = getCookie("gh-token");

    if (username) document.getElementById("gh-username").value = username;
    if (token) document.getElementById("gh-token").value = token;
};

// Lưu thông tin username & token vào cookie mỗi khi người dùng thay đổi input
document.getElementById("gh-username").addEventListener("input", function () {
    setCookie("gh-username", this.value, 7);
});

document.getElementById("gh-token").addEventListener("input", function () {
    setCookie("gh-token", this.value, 7);
});
