function switchAuth(type) {
    const login =
        type === "login";
    document
        .getElementById("loginForm")
        .classList
        .toggle(
            "hidden",
            !login
        );
    document
        .getElementById("registerForm")
        .classList
        .toggle(
            "hidden",
            login
        );
    document
        .getElementById("loginTab")
        .classList
        .toggle(
            "active",
            login
        );
        
    document
        .getElementById("registerTab")
        .classList
        .toggle(
            "active",
            !login
        );
    document
        .getElementById("authTitle")
        .textContent =
        login
        ? "Welcome back"
        : "Create your account";
    document
        .getElementById("authSubtitle")
        .textContent =
        login
        ? "Login to continue to your campus workspace."
        : "Register first, then login with your account.";
}
document
    .getElementById("registerAvatar")
    .addEventListener(
        "change",
        async function(event) {
            const file =
                event.target.files[0];
            if (!file) return;
            if (
                file.size >
                2.5 * 1024 * 1024
            ) {
                showToast(
                    "Image must be smaller than 2.5 MB"
                );
                event.target.value = "";
                return;
            }
            registerAvatarData =
                await imageToBase64(file);
            document
                .getElementById(
                    "registerAvatarPreview"
                )
                .src =
                registerAvatarData;
        }
    );
document
    .getElementById("registerForm")
    .addEventListener(
        "submit",
        async function(event) {
            event.preventDefault();
            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();
            const email =
                normalize(
                    document
                        .getElementById("registerEmail")
                        .value
                );
            const password =
                document
                    .getElementById("registerPassword")
                    .value;
            const confirmPassword =
                document
                    .getElementById("registerConfirm")
                    .value;
            const university =
                document
                    .getElementById("registerUniversity")
                    .value
                    .trim();
            if (
                password !==
                confirmPassword
            ) {
                showToast(
                    "Passwords do not match"
                );
                return;
            }
            const emailExists =
                db.users.some(
                    user =>
                        normalize(user.email) ===
                        email
                );
            if (emailExists) {
                showToast(
                    "This email is already registered"
                );
                return;
            }
            const newUser = {
                id:
                    generateId("user"),
                name:
                    name,
                email:
                    email,
                passwordHash:
                    await hashPassword(password),
                university:
                    university ||
                    "University Student",
                bio:
                    "New SkillSwap member",
                avatar:
                    registerAvatarData || "",
                createdAt:
                    new Date().toISOString()
            };
            db.users.push(newUser);
            saveDatabase();
            document
                .getElementById("registerForm")
                .reset();
            registerAvatarData = "";
            document
                .getElementById(
                    "registerAvatarPreview"
                )
                .src =
                getAvatar(newUser);
            document
                .getElementById("loginEmail")
                .value =
                email;
            switchAuth("login");
            showToast(
                "Registration successful. Please login."
            );
        }
    );
document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        async function(event) {
            event.preventDefault();
            const email =
                normalize(
                    document
                        .getElementById("loginEmail")
                        .value
                );
            const password =
                document
                    .getElementById("loginPassword")
                    .value;
            const user =
                db.users.find(
                    item =>
                        normalize(item.email) ===
                        email
                );
            if (!user) {
                showToast(
                    "Account not found. Please register first."
                );
                return;
            }
            const passwordHash =
                await hashPassword(password);
            if (
                passwordHash !==
                user.passwordHash
            ) {
                showToast(
                    "Invalid email or password"
                );
                return;
            }
            localStorage.setItem(
                SESSION_KEY,
                user.id
            );
            currentUser = user;
            enterApplication();
        }
    );
function checkSession() {
    const userId =
        localStorage.getItem(
            SESSION_KEY
        );
    if (!userId) {
        showAuthentication();
        return;
    }
    currentUser =
        db.users.find(
            user =>
                user.id === userId
        );
    if (!currentUser) {
        localStorage.removeItem(
            SESSION_KEY
        );
        showAuthentication();
        return;
    }
    enterApplication();
}
function showAuthentication() {
    document
        .getElementById("authScreen")
        .style
        .display =
        "grid";
    document
        .getElementById("app")
        .style
        .display =
        "none";
}
function enterApplication() {
    document
        .getElementById("authScreen")
        .style
        .display =
        "none";
    document
        .getElementById("app")
        .style
        .display =
        "block";
    refreshApplication();
}
function logout() {
    localStorage.removeItem(
        SESSION_KEY
    );
    currentUser = null;
    document
        .getElementById("app")
        .style
        .display =
        "none";
    document
        .getElementById("authScreen")
        .style
        .display =
        "grid";
    switchAuth("login");
    document
        .getElementById("loginPassword")
        .value = "";
    showToast(
        "Logged out successfully"
    );
}
