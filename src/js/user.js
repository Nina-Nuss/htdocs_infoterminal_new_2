class User {
    static temp_remove = [];
    static eleListe = []
    static list = [];
    constructor(id, username, isAdmin) {
        this.id = id;
        this.username = username;
        this.isAdmin = isAdmin;
        User.list.push(this);
    }
    static async update() {
        var deleteUserTable = document.getElementById('deleteUser');
        deleteUserTable.innerHTML = '';
        this.list = [];
        const listUsers = await this.get_all_users()
        listUsers.forEach(user => {
            new User(user.id, user.username, user.is_admin)
            if (user.is_admin == 1) {
                var isAdmin = "Ja"
            }else{
                var isAdmin = "Nein"
            }
            deleteUserTable.innerHTML += `
                    <tr class="border-bottom">
                        <td class="p-2">${user.id}</td>
                        <td class="p-2">${user.username}</td>
                        <td class="p-2">${isAdmin}</td>
                        <td class="p-2"><input type="checkbox" id="checkDelUser${user.id}" onchange="Crud.event_remove_user(${user.id})"></td>
                    </tr>
                `;
        });
        console.log(this.list);
        //temp_remove, list, eleListe
    }
    static async get_all_users() {
        try {
            const response = await fetch('/src/database/selectUser.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const users = await response.json();
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }
}

User.update();
