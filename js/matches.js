function toggleFavorite(skillId) {
    const index =
        db.favorites.findIndex(
            favorite =>
                favorite.userId ===
                currentUser.id
                &&
                favorite.skillId ===
                skillId
        );
    if (index >= 0) {
        db.favorites.splice(
            index,
            1
        );
    } else {
        db.favorites.push({
            userId:
                currentUser.id,
            skillId:
                skillId
        });
    }
    saveDatabase();
    refreshApplication();
}
function renderFavorites() {
    const grid =
        document.getElementById(
            "favoritesGrid"
        );
    if (!grid || !currentUser) return;
    const favoriteIds =
        db.favorites
            .filter(
                item =>
                    item.userId ===
                    currentUser.id
            )
            .map(
                item =>
                    item.skillId
            );
    const favoriteSkills =
        db.skills.filter(
            skill =>
                favoriteIds.includes(
                    skill.id
                )
                &&
                skill.userId !==
                currentUser.id
        );
    renderSkillCards(
        grid,
        favoriteSkills
    );
}
function openStudent(userId) {
    const user =
        db.users.find(
            item =>
                item.id ===
                userId
        );
    if (!user) return;
    const skills =
        db.skills.filter(
            skill =>
                skill.userId ===
                user.id
        );
    document
        .getElementById("providerContent")
        .innerHTML = `
            <div
                style="
                text-align:center;
                padding:15px 0;
                "
            >
                <img
                    src="${getAvatar(user)}"
                    style="
                    width:95px;
                    height:95px;
                    border-radius:50%;
                    object-fit:cover;
                    "
                >
                <h4
                    style="
                    font-weight:800;
                    margin:12px 0 2px;
                    "
                >
                    ${escapeHTML(
                        user.name
                    )}
                </h4>
                <div
                    style="
                    font-size:12px;
                    color:#999;
                    "
                >
                    ${escapeHTML(
                        user.email
                    )}
                </div>
                <div
                    style="
                    font-size:12px;
                    color:#777;
                    margin-top:10px;
                    "
                >
                    ${escapeHTML(
                        user.bio ||
                        "SkillSwap student"
                    )}
                </div>
            </div>
            <div
                style="
                font-size:12px;
                font-weight:800;
                margin:15px 0 8px;
                "
            >
                Skills they provide
            </div>
            ${
                skills.length
                ?
                skills.map(
                    skill => `
                        <div
                            class="list-item"
                        >
                            <div
                                class="skill-icon"
                                style="
                                width:40px;
                                height:40px;
                                "
                            >
                                <i
                                    class="bi ${
                                        skill.icon ||
                                        "bi-lightbulb"
                                    }"
                                ></i>
                            </div>
                            <div>
                                <b
                                    style="
                                    font-size:13px;
                                    "
                                >
                                    ${escapeHTML(
                                        skill.name
                                    )}
                                </b>
                                <div
                                    style="
                                    font-size:10px;
                                    color:#999;
                                    "
                                >
                                    ${escapeHTML(
                                        skill.category
                                    )}
                                </div>
                            </div>
                        </div>
                    `
                ).join("")
                :
                `
                    <div
                        style="
                        font-size:12px;
                        color:#999;
                        "
                    >
                        No skills added yet.
                    </div>
                `
            }
            <button
                class="
                primary-button
                w-100
                mt-3
                "
                onclick="
                    requestMatch(
                        '${user.id}'
                    )
                "
            >
                Request Skill Exchange
            </button>
        `;
    document
        .getElementById("providerModal")
        .classList
        .add("show");
}
function findRandomMatch() {
    if (!currentUser) return;
    const candidates =
        db.users.filter(
            user => user.id !== currentUser.id
        );
    const candidatesWithSkills =
        candidates.filter(
            user =>
                db.skills.some(
                    skill => skill.userId === user.id
                )
        );
    const pool =
        candidatesWithSkills.length
            ? candidatesWithSkills
            : candidates;
    const content =
        document.getElementById(
            "randomMatchContent"
        );
    if (!pool.length) {
        content.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-people"></i>
                <b>No other students yet</b>
                <div>
                    Ask another student to register on SkillSwap.
                </div>
            </div>
        `;
        document
            .getElementById("randomMatchModal")
            .classList.add("show");
        return;
    }
    const randomStudent =
        pool[
            Math.floor(
                Math.random() * pool.length
            )
        ];
    const studentSkills =
        db.skills.filter(
            skill =>
                skill.userId ===
                randomStudent.id
        );
    content.innerHTML = `
        <div style="text-align:center; padding:8px 0 4px">
            <img
                src="${getAvatar(randomStudent)}"
                alt="Student"
                style="
                    width:105px;
                    height:105px;
                    border-radius:50%;
                    object-fit:cover;
                    border:4px solid #eeeaff;
                "
            >
            <h4
                style="
                    font-weight:800;
                    margin:13px 0 3px;
                "
            >
                ${escapeHTML(randomStudent.name)}
            </h4>
            <div
                style="
                    font-size:12px;
                    color:#999;
                "
            >
                ${escapeHTML(
                    randomStudent.university ||
                    "University Student"
                )}
            </div>
            <p
                style="
                    font-size:12px;
                    color:#777;
                    margin:12px auto;
                    max-width:400px;
                "
            >
                ${escapeHTML(
                    randomStudent.bio ||
                    "SkillSwap community member."
                )}
            </p>
        </div>
        <div
            style="
                font-size:12px;
                font-weight:800;
                margin:16px 0 8px;
            "
        >
            Skills they provide
        </div>
        <div style="
            display:flex;
            flex-wrap:wrap;
            gap:7px;
        ">
            ${
                studentSkills.length
                ?
                studentSkills.map(
                    skill => `
                        <span class="soft-badge">
                            ${escapeHTML(skill.name)}
                        </span>
                    `
                ).join("")
                :
                `
                    <span
                        style="
                            font-size:12px;
                            color:#999;
                        "
                    >
                        No skills added yet.
                    </span>
                `
            }
        </div>
        <div
            style="
                display:flex;
                gap:9px;
                margin-top:20px;
            "
        >
            <button
                class="btn btn-outline-secondary"
                style="flex:1"
                onclick="openStudent('${randomStudent.id}')"
            >
                <i class="bi bi-person"></i>
                View Profile
            </button>
            <button
                class="primary-button"
                style="flex:1"
                onclick="requestMatch('${randomStudent.id}')"
            >
                <i class="bi bi-stars"></i>
                Request Match
            </button>
        </div>
        <button
            class="btn btn-light w-100 mt-2"
            onclick="findRandomMatch()"
        >
            <i class="bi bi-shuffle"></i>
            Try Another Student
        </button>
    `;
    document
        .getElementById("randomMatchModal")
        .classList.add("show");
}
function requestMatch(userId) {
    if (
        userId ===
        currentUser.id
    ) {
        showToast(
            "You cannot match with yourself"
        );
        return;
    }
    const alreadyExists =
        db.matches.some(
            match =>
                (
                    match.from ===
                    currentUser.id
                    &&
                    match.to ===
                    userId
                )
                ||
                (
                    match.to ===
                    currentUser.id
                    &&
                    match.from ===
                    userId
                )
        );
    if (alreadyExists) {
        showToast(
            "You already requested this student"
        );
        return;
    }
    db.matches.push({
        id:
            generateId("match"),
        from:
            currentUser.id,
        to:
            userId,
        status:
            "pending",
        createdAt:
            new Date().toISOString()
    });
    saveDatabase();
    closeModal(
        "providerModal"
    );
    closeModal(
        "randomMatchModal"
    );
    refreshApplication();
    showToast(
        "Skill exchange request sent"
    );
}
function renderMatches() {
    const box =
        document.getElementById(
            "matchesList"
        );
    if (!box || !currentUser) return;
    const matches =
        db.matches.filter(
            match =>
                match.from ===
                currentUser.id
                ||
                match.to ===
                currentUser.id
        );
    if (!matches.length) {
        box.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-stars"></i>
                <b>
                    No matches yet
                </b>
                <div>
                    Explore a skill and request an exchange.
                </div>
            </div>
        `;
        return;
    }
    box.innerHTML =
        matches.map(
            match => {
                const otherUser =
                    db.users.find(
                        user =>
                            user.id ===
                            (
                                match.from ===
                                currentUser.id
                                ?
                                match.to
                                :
                                match.from
                            )
                    );
                if (!otherUser) return "";
                return `
                    <div class="list-item">
                        <img
                            src="${getAvatar(
                                otherUser
                            )}"
                        >
                        <div
                            style="flex:1"
                        >
                            <b
                                style="
                                font-size:13px;
                                "
                            >
                                ${escapeHTML(
                                    otherUser.name
                                )}
                            </b>
                            <div
                                style="
                                font-size:11px;
                                color:#999;
                                "
                            >
                                ${escapeHTML(
                                    match.status
                                )}
                            </div>
                        </div>
                        <span
                            class="soft-badge"
                        >
                            ${escapeHTML(
                                match.status
                            )}
                        </span>
                    </div>
                `;
            }
        ).join("");
}
function bookSession(userId) {
    db.sessions.push({
        id:
            generateId("session"),
        userId:
            currentUser.id,
        withUser:
            userId,
        status:
            "upcoming",
        date:
            new Date(
                Date.now() +
                86400000
            ).toISOString()
    });
    saveDatabase();
    refreshApplication();
    showToast(
        "Session booked"
    );
}
function cancelSession(sessionId) {
    db.sessions =
        db.sessions.filter(
            session =>
                session.id !==
                sessionId
        );
    saveDatabase();
    refreshApplication();
    showToast(
        "Session cancelled"
    );
}
function renderSessions() {
    const box =
        document.getElementById(
            "sessionsList"
        );
    if (!box || !currentUser) return;
    const sessions =
        db.sessions.filter(
            session =>
                session.userId ===
                currentUser.id
        );
    if (!sessions.length) {
        box.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-calendar3"></i>
                <b>
                    No sessions yet
                </b>
                <div>
                    Your sessions will appear here.
                </div>
            </div>
        `;
        return;
    }
    box.innerHTML =
        sessions.map(
            session => {
                const user =
                    db.users.find(
                        item =>
                            item.id ===
                            session.withUser
                    );
                return `
                    <div class="list-item">
                        <img
                            src="${getAvatar(user)}"
                        >
                        <div
                            style="flex:1"
                        >
                            <b
                                style="
                                font-size:13px;
                                "
                            >
                                ${escapeHTML(
                                    user?.name ||
                                    "Student"
                                )}
                            </b>
                            <div
                                style="
                                font-size:11px;
                                color:#999;
                                "
                            >
                                ${new Date(
                                    session.date
                                ).toLocaleString()}
                            </div>
                        </div>
                        <button
                            class="
                            btn
                            btn-sm
                            btn-outline-danger
                            "
                            onclick="
                                cancelSession(
                                    '${session.id}'
                                )
                            "
                        >
                            Cancel
                        </button>
                    </div>
                `;
            }
        ).join("");
}
