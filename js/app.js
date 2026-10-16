const DB_KEY =
    "skillswap_dynamic_database_v2";
const SESSION_KEY =
    "skillswap_current_user_v2";
let db =
    loadDatabase();
let currentUser = null;
let registerAvatarData = "";
let editAvatarData = "";
function loadDatabase() {
    try {
        const saved =
            localStorage.getItem(DB_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch(error) {
        console.error(error);
    }
    return {
        users: [],
        skills: [],
        matches: [],
        sessions: [],
        favorites: []
    };
}
function saveDatabase() {
    localStorage.setItem(
        DB_KEY,
        JSON.stringify(db)
    );
}
function generateId(prefix = "id") {
    return (
        prefix +
        "_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );
}
function normalize(value) {
    return String(value || "")
        .trim()
        .toLowerCase();
}
function escapeHTML(value) {
    return String(value ?? "")
        .replace(/[&<>"']/g, function(char) {
            const map = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };
            return map[char];
        });
}
function getAvatar(user) {
    if (user && user.avatar) {
        return user.avatar;
    }
    const name =
        encodeURIComponent(
            (user?.name || "User")
                .substring(0,1)
                .toUpperCase()
        );
    return (
        "https://ui-avatars.com/api/" +
        "?name=" + name +
        "&background=6c5ce7" +
        "&color=fff" +
        "&bold=true"
    );
}
async function hashPassword(password) {
    const data =
        new TextEncoder()
            .encode(password);
    const hash =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );
    return Array
        .from(new Uint8Array(hash))
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2,"0")
        )
        .join("");
}
function imageToBase64(file) {
    return new Promise(
        (resolve, reject) => {
            const reader =
                new FileReader();
            reader.onload =
                () => resolve(reader.result);
            reader.onerror =
                reject;
            reader.readAsDataURL(file);
        }
    );
}
function closeModal(id) {
    document
        .getElementById(id)
        .classList
        .remove("show");
}
function showToast(message) {
    const toast =
        document.getElementById(
            "toast"
        );
    toast.textContent =
        message;
    toast.style.display =
        "block";
    clearTimeout(
        window.toastTimer
    );
    window.toastTimer =
        setTimeout(
            function() {
                toast.style.display =
                    "none";
            },
            2600
        );
}
function generateRandomDemoData() {
    const names = [
        "Ali Raza",
        "Ahmed Khan",
        "Sara Ahmed",
        "Hamza Malik",
        "Ayesha Noor",
        "Usman Ali",
        "Hina Shah",
        "Bilal Ahmed",
        "Fatima Khan",
        "Danish Raza"
    ];
    const universities = [
        "Mehran University",
        "NED University",
        "University of Sindh",
        "FAST University",
        "IBA Karachi"
    ];
    const skillPool = [
        {
            name:
                "Java",
            category:
                "Programming",
            description:
                "Core Java, OOP and Java fundamentals.",
            icon:
                "bi-code-slash"
        },
        {
            name:
                "Spring Boot",
            category:
                "Programming",
            description:
                "Spring Boot and REST API development.",
            icon:
                "bi-code-slash"
        },
        {
            name:
                "Python",
            category:
                "Programming",
            description:
                "Python programming from beginner to intermediate.",
            icon:
                "bi-filetype-py"
        },
        {
            name:
                "React",
            category:
                "Programming",
            description:
                "Modern React development.",
            icon:
                "bi-code-slash"
        },
        {
            name:
                "Photoshop",
            category:
                "Design",
            description:
                "Photoshop photo editing and manipulation.",
            icon:
                "bi-palette"
        },
        {
            name:
                "UI/UX Design",
            category:
                "Design",
            description:
                "Modern UI and UX design.",
            icon:
                "bi-palette"
        },
        {
            name:
                "Graphic Design",
            category:
                "Design",
            description:
                "Logo, poster and branding design.",
            icon:
                "bi-brush"
        },
        {
            name:
                "Digital Marketing",
            category:
                "Business",
            description:
                "Digital marketing and social media.",
            icon:
                "bi-briefcase"
        },
        {
            name:
                "English",
            category:
                "Languages",
            description:
                "English speaking and communication.",
            icon:
                "bi-translate"
        },
        {
            name:
                "Mathematics",
            category:
                "Academic",
            description:
                "Mathematics and problem solving.",
            icon:
                "bi-book"
        }
    ];
    let createdUsers = [];
    names.forEach(
        function(name,index) {
            const email =
                name
                    .toLowerCase()
                    .replaceAll(" ",".")
                    +
                    index
                    +
                    "@demo.skillswap";
            if (
                db.users.some(
                    user =>
                        user.email ===
                        email
                )
            ) {
                return;
            }
            const user = {
                id:
                    generateId("demoUser"),
                name:
                    name,
                email:
                    email,
                passwordHash:
                    "demo",
                university:
                    universities[
                        Math.floor(
                            Math.random() *
                            universities.length
                        )
                    ],
                bio:
                    "Student and SkillSwap community member.",
                avatar:
                    "https://ui-avatars.com/api/" +
                    "?name=" +
                    encodeURIComponent(name) +
                    "&background=random" +
                    "&color=fff" +
                    "&bold=true",
                createdAt:
                    new Date(
                        Date.now() -
                        Math.random() *
                        30 *
                        86400000
                    ).toISOString()
            };
            db.users.push(
                user
            );
            createdUsers.push(
                user
            );
        }
    );
    createdUsers.forEach(
        function(user) {
            const numberOfSkills =
                Math.floor(
                    Math.random() * 3
                ) + 2;
            const shuffled =
                [...skillPool].sort(
                    () =>
                        Math.random() -
                        0.5
                );
            shuffled
                .slice(
                    0,
                    numberOfSkills
                )
                .forEach(
                    function(skill) {
                        db.skills.push({
                            id:
                                generateId(
                                    "skill"
                                ),
                            userId:
                                user.id,
                            name:
                                skill.name,
                            category:
                                skill.category,
                            description:
                                skill.description,
                            icon:
                                skill.icon,
                            rating:
                                Number(
                                    (
                                        4 +
                                        Math.random()
                                    ).toFixed(1)
                                ),
                            createdAt:
                                new Date(
                                    Date.now() -
                                    Math.random() *
                                    20 *
                                    86400000
                                ).toISOString()
                        });
                    }
                );
        }
    );
    const javaUsers =
        db.users
            .filter(
                user =>
                    user.id !==
                    currentUser.id
            )
            .slice(0,5);
    javaUsers.forEach(
        function(user) {
            const exists =
                db.skills.some(
                    skill =>
                        skill.userId ===
                        user.id
                        &&
                        normalize(
                            skill.name
                        ) ===
                        "java"
                );
            if (!exists) {
                db.skills.push({
                    id:
                        generateId(
                            "javaSkill"
                        ),
                    userId:
                        user.id,
                    name:
                        "Java",
                    category:
                        "Programming",
                    description:
                        "I can teach Java programming, OOP and backend fundamentals.",
                    icon:
                        "bi-code-slash",
                    rating:
                        Number(
                            (
                                4 +
                                Math.random()
                            ).toFixed(1)
                        ),
                    createdAt:
                        new Date().toISOString()
                });
            }
        }
    );
    saveDatabase();
    refreshApplication();
    showToast(
        `${createdUsers.length} random students added`
    );
}
