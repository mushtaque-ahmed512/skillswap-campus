function renderLeaderboard() {
    const box =
        document.getElementById(
            "leaderboardList"
        );
    if (!box) return;
    const users =
        [...db.users].sort(
            (a,b) => {
                const aSkills =
                    db.skills.filter(
                        skill =>
                            skill.userId ===
                            a.id
                    ).length;
                const bSkills =
                    db.skills.filter(
                        skill =>
                            skill.userId ===
                            b.id
                    ).length;
                return bSkills - aSkills;
            }
        );
    if (!users.length) {
        box.innerHTML = `
            <div class="empty-state">
                No students registered yet.
            </div>
        `;
        return;
    }
    box.innerHTML =
        users.map(
            (user,index) => {
                const skillCount =
                    db.skills.filter(
                        skill =>
                            skill.userId ===
                            user.id
                    ).length;
                return `
                    <div class="list-item">
                        <div
                            style="
                            width:30px;
                            font-weight:800;
                            color:#888;
                            "
                        >
                            #${index + 1}
                        </div>
                        <img
                            src="${getAvatar(
                                user
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
                                    user.name
                                )}
                            </b>
                            <div
                                style="
                                font-size:10px;
                                color:#999;
                                "
                            >
                                ${skillCount}
                                skills shared
                            </div>
                        </div>
                        ${
                            user.id ===
                            currentUser?.id
                            ?
                            `
                            <span
                                class="soft-badge"
                            >
                                You
                            </span>
                            `
                            :
                            ""
                        }
                    </div>
                `;
            }
        ).join("");
}
function openEditProfile() {
    document
        .getElementById("editName")
        .value =
        currentUser.name || "";
    document
        .getElementById("editUniversity")
        .value =
        currentUser.university || "";
    document
        .getElementById("editBio")
        .value =
        currentUser.bio || "";
    editAvatarData =
        currentUser.avatar || "";
    document
        .getElementById(
            "editAvatarPreview"
        )
        .src =
        getAvatar(currentUser);
    document
        .getElementById("profileModal")
        .classList
        .add("show");
}
document
    .getElementById("editAvatar")
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
                return;
            }
            editAvatarData =
                await imageToBase64(file);
            document
                .getElementById(
                    "editAvatarPreview"
                )
                .src =
                editAvatarData;
        }
    );
document
    .getElementById("profileForm")
    .addEventListener(
        "submit",
        function(event) {
            event.preventDefault();
            const user =
                db.users.find(
                    item =>
                        item.id ===
                        currentUser.id
                );
            if (!user) return;
            user.name =
                document
                    .getElementById("editName")
                    .value
                    .trim();
            user.university =
                document
                    .getElementById(
                        "editUniversity"
                    )
                    .value
                    .trim();
            user.bio =
                document
                    .getElementById("editBio")
                    .value
                    .trim();
            user.avatar =
                editAvatarData || "";
            currentUser =
                user;
            saveDatabase();
            closeModal(
                "profileModal"
            );
            refreshApplication();
            showToast(
                "Profile updated successfully"
            );
        }
    );
