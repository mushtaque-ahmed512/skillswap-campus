function refreshApplication() {
    if (!currentUser) return;
    currentUser =
        db.users.find(
            user =>
                user.id ===
                currentUser.id
        );
    if (!currentUser) {
        logout();
        return;
    }
    const avatar =
        getAvatar(currentUser);
    document
        .getElementById("topAvatar")
        .src =
        avatar;
    document
        .getElementById("topUserName")
        .textContent =
        currentUser.name;
    document
        .getElementById("heroName")
        .textContent =
        currentUser.name
            .split(" ")[0];
    document
        .getElementById("profileAvatar")
        .src =
        avatar;
    document
        .getElementById("profileName")
        .textContent =
        currentUser.name;
    document
        .getElementById("profileEmail")
        .textContent =
        currentUser.email;
    document
        .getElementById("profileBio")
        .textContent =
        currentUser.bio || "";
    document
        .getElementById("profileUniversity")
        .textContent =
        currentUser.university ||
        "University Student";
    document
        .getElementById("statUsers")
        .textContent =
        db.users.length;
    document
        .getElementById("statSkills")
        .textContent =
        db.skills.length;
    document
        .getElementById("statMatches")
        .textContent =
        db.matches.filter(
            match =>
                match.from === currentUser.id ||
                match.to === currentUser.id
        ).length;
    document
        .getElementById("statFavorites")
        .textContent =
        db.favorites.filter(
            favorite =>
                favorite.userId ===
                currentUser.id
        ).length;
    renderSkills();
    renderDashboardSkills();
    renderMySkills();
    renderFavorites();
    renderMatches();
    renderSessions();
    renderLeaderboard();
}
function showPage(pageName) {
    document
        .querySelectorAll(".page")
        .forEach(
            page =>
                page.classList.remove("active")
        );
    const page =
        document.getElementById(pageName);
    if (page) {
        page.classList.add("active");
    }
    document
        .querySelectorAll(
            ".nav-link-custom[data-page]"
        )
        .forEach(link => {
            link.classList.toggle(
                "active",
                link.dataset.page === pageName
            );
        });
    document
        .getElementById("sidebar")
        .classList
        .remove("open");
    if (pageName === "explore") {
        renderSkills();
    }
    if (pageName === "favorites") {
        renderFavorites();
    }
    if (pageName === "profile") {
        renderMySkills();
    }
}
function toggleSidebar() {
    document
        .getElementById("sidebar")
        .classList
        .toggle("open");
}
function getVisibleSkills() {
    return db.skills.filter(
        skill =>
            skill.userId !==
            currentUser.id
    );
}
function renderSkills() {
    const grid =
        document.getElementById(
            "skillsGrid"
        );
    if (!grid || !currentUser) return;
    let skills =
        getVisibleSkills();
    const search =
        normalize(
            document
                .getElementById("skillSearch")
                ?.value
        );
    const category =
        document
            .getElementById("categoryFilter")
            ?.value || "";
    const sort =
        document
            .getElementById("sortSkills")
            ?.value ||
        "newest";
    if (search) {
        skills =
            skills.filter(
                skill =>
                    normalize(skill.name)
                        .includes(search)
                    ||
                    normalize(
                        skill.description
                    ).includes(search)
            );
    }
    if (category) {
        skills =
            skills.filter(
                skill =>
                    skill.category ===
                    category
            );
    }
    if (sort === "name") {
        skills.sort(
            (a,b) =>
                a.name.localeCompare(b.name)
        );
    } else {
        skills.sort(
            (a,b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );
    }
    renderSkillCards(
        grid,
        skills
    );
}
function renderDashboardSkills() {
    const grid =
        document.getElementById(
            "dashboardSkills"
        );
    if (!grid || !currentUser) return;
    const skills =
        getVisibleSkills()
            .slice(0,6);
    renderSkillCards(
        grid,
        skills
    );
}
function renderSkillCards(
    container,
    skills
) {
    if (!skills.length) {
        container.innerHTML = `
            <div
                class="empty-state"
                style="grid-column:1/-1"
            >
                <i class="bi bi-search"></i>
                <b>
                    No skills found
                </b>
                <div>
                    Try another skill.
                </div>
            </div>
        `;
        return;
    }
    container.innerHTML =
        skills.map(
            skill => {
                const provider =
                    db.users.find(
                        user =>
                            user.id ===
                            skill.userId
                    );
                if (!provider) {
                    return "";
                }
                const favorite =
                    db.favorites.some(
                        item =>
                            item.userId ===
                            currentUser.id
                            &&
                            item.skillId ===
                            skill.id
                    );
                return `
                    <div class="skill-card">
                        <div class="skill-top">
                            <div class="skill-icon">
                                <i
                                    class="bi ${
                                        skill.icon ||
                                        "bi-lightbulb"
                                    }"
                                ></i>
                            </div>
                            <button
                                class="
                                favorite-button
                                ${
                                    favorite
                                    ? "active"
                                    : ""
                                }
                                "
                                onclick="
                                    toggleFavorite(
                                        '${skill.id}'
                                    )
                                "
                            >
                                <i
                                    class="bi ${
                                        favorite
                                        ? "bi-heart-fill"
                                        : "bi-heart"
                                    }"
                                ></i>
                            </button>
                        </div>
                        <span
                            class="soft-badge"
                            style="margin-top:12px"
                        >
                            ${escapeHTML(
                                skill.category
                            )}
                        </span>
                        <h6>
                            ${escapeHTML(
                                skill.name
                            )}
                        </h6>
                        <p class="skill-description">
                            ${escapeHTML(
                                skill.description ||
                                "Ready to share this skill."
                            )}
                        </p>
                        <div class="provider">
                            <img
                                src="${getAvatar(provider)}"
                                alt="Provider"
                            >
                            <div
                                style="
                                flex:1
                                "
                            >
                                <div
                                    class="provider-name"
                                >
                                    ${escapeHTML(
                                        provider.name
                                    )}
                                </div>
                                <div
                                    class="provider-meta"
                                >
                                    ${escapeHTML(
                                        provider.university ||
                                        "Student"
                                    )}
                                </div>
                            </div>
                            <button
                                class="
                                btn
                                btn-sm
                                btn-outline-secondary
                                "
                                onclick="
                                    openStudent(
                                        '${provider.id}'
                                    )
                                "
                            >
                                Profile
                            </button>
                        </div>
                    </div>
                `;
            }
        ).join("");
}
function openAddSkill() {
    document
        .getElementById("skillForm")
        .reset();
    document
        .getElementById("skillModal")
        .classList
        .add("show");
}
document
    .getElementById("skillForm")
    .addEventListener(
        "submit",
        function(event) {
            event.preventDefault();
            const name =
                document
                    .getElementById("newSkillName")
                    .value
                    .trim();
            const category =
                document
                    .getElementById(
                        "newSkillCategory"
                    )
                    .value;
            const description =
                document
                    .getElementById(
                        "newSkillDescription"
                    )
                    .value
                    .trim();
            const duplicate =
                db.skills.some(
                    skill =>
                        skill.userId ===
                        currentUser.id
                        &&
                        normalize(skill.name) ===
                        normalize(name)
                );
            if (duplicate) {
                showToast(
                    "You already added this skill"
                );
                return;
            }
            const newSkill = {
                id:
                    generateId("skill"),
                userId:
                    currentUser.id,
                name:
                    name,
                category:
                    category,
                description:
                    description,
                icon:
                    getCategoryIcon(category),
                rating:
                    5,
                createdAt:
                    new Date().toISOString()
            };
            db.skills.push(
                newSkill
            );
            saveDatabase();
            closeModal(
                "skillModal"
            );
            refreshApplication();
            showToast(
                "Skill added successfully"
            );
        }
    );
function getCategoryIcon(category) {
    const icons = {
        Programming:
            "bi-code-slash",
        Design:
            "bi-palette",
        Business:
            "bi-briefcase",
        Languages:
            "bi-translate",
        Academic:
            "bi-book",
        Creative:
            "bi-brush"
    };
    return (
        icons[category] ||
        "bi-lightbulb"
    );
}
function renderMySkills() {
    const grid =
        document.getElementById(
            "mySkillsGrid"
        );
    if (!grid || !currentUser) return;
    const mySkills =
        db.skills.filter(
            skill =>
                skill.userId ===
                currentUser.id
        );
    if (!mySkills.length) {
        grid.innerHTML = `
            <div
                class="empty-state card-box"
                style="grid-column:1/-1"
            >
                <i class="bi bi-lightbulb"></i>
                <b>
                    You have no skills yet
                </b>
                <div>
                    Add a skill that you can teach.
                </div>
            </div>
        `;
        return;
    }
    grid.innerHTML =
        mySkills.map(
            skill => `
                <div class="skill-card">
                    <div class="skill-icon">
                        <i
                            class="bi ${
                                skill.icon ||
                                "bi-lightbulb"
                            }"
                        ></i>
                    </div>
                    <span
                        class="soft-badge"
                        style="margin-top:12px"
                    >
                        ${escapeHTML(
                            skill.category
                        )}
                    </span>
                    <h6>
                        ${escapeHTML(
                            skill.name
                        )}
                    </h6>
                    <p
                        class="skill-description"
                    >
                        ${escapeHTML(
                            skill.description ||
                            ""
                        )}
                    </p>
                    <button
                        class="
                        btn
                        btn-sm
                        btn-outline-danger
                        "
                        onclick="
                            deleteSkill(
                                '${skill.id}'
                            )
                        "
                    >
                        <i class="bi bi-trash"></i>
                        Delete
                    </button>
                </div>
            `
        ).join("");
}
function deleteSkill(skillId) {
    const skill =
        db.skills.find(
            item =>
                item.id ===
                skillId
        );
    if (!skill) return;
    if (
        skill.userId !==
        currentUser.id
    ) {
        return;
    }
    const confirmDelete =
        confirm(
            `Delete "${skill.name}"?`
        );
    if (!confirmDelete) return;
    db.skills =
        db.skills.filter(
            item =>
                item.id !==
                skillId
        );
    db.favorites =
        db.favorites.filter(
            item =>
                item.skillId !==
                skillId
        );
    saveDatabase();
    refreshApplication();
    showToast(
        "Skill deleted"
    );
}
function globalSearch(value) {
    if (!value.trim()) {
        return;
    }
    showPage("explore");
    document
        .getElementById("skillSearch")
        .value =
        value;
    renderSkills();
}
