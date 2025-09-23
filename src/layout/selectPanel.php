<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
<div id="selectPanel">
    <div class="col-md-12 mx-auto pl-auto bg-gray-100 d-flex align-items-center justify-content-center p-0">
        <div class="d-flex position-relative w-100 align-items-center">
            <div class="d-flex justify-content-center gap-2 w-100" id="startBtns">
                <button type="button" id="infotherminalBereich"
                    class="btn text-dark start-btn navbuttons">Infoterminal</button>
                <button id="templates" type="button" class="btn text-dark start-btn navbuttons">Templates</button>
                <button id="adminBereich" type="button" class="btn text-dark start-btn navbuttons">Administration</button>
                <div class="d-flex align-items-center justify-content-end position-absolute me-auto end-0">
                    <i id="themeToggle" class="bi bi-sun me-2" style="font-size: 1.5rem; cursor: pointer;" aria-label="Theme wechseln" title="Theme wechseln"></i>
                    <div class="d-flex align-items-center">
                        <i class="bi bi-person-circle me-2" style="font-size: 1.5rem;"></i>
                        <span id="usernameDisplay">
                            <?php
                            if (isset($_SESSION['username'])) {
                                echo $_SESSION['username'];
                            } else if (isset($_COOKIE['username'])) {
                                echo $_COOKIE['username'];
                            }
                            ?>
                        </span>

                    </div>
                    <button id="logout" type="button" onclick="logout()" class="btn text-dark start-btn adddelLogoutbtn"
                        aria-label="Logout" title="Logout">
                        <i class="bi bi-box-arrow-right"></i>
                    </button>
                </div>
            </div>


        </div>
    </div>
</div>
<script>
    if (window.location.href.includes("dashboard.php")) {
        document.getElementById("infotherminalBereich").classList.add("btn-active");
    } else if (window.location.href.includes("adminbereich.php")) {
        document.getElementById("adminBereich").classList.add("btn-active");
    } else if (window.location.href.includes("templates.php")) {
        document.getElementById("templates").classList.add("btn-active");
    }
</script>