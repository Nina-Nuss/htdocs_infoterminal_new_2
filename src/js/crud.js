class Crud {

    static async deletee(idDelete, databaseUrl) {
        console.log("deletee wurde aufgerufen");
        const response = await fetch(`../database/${databaseUrl}.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: idDelete })
        })

            .then(response => response.text())
            .then(data => {
                if (data) {
                    console.log('User erfolgreich gelöscht');
                } else {
                    console.error('Fehler beim Löschen des Users:', data.message);
                }
            })
            .catch(error => {
                console.error('Fetch-Fehler:', error);
            });
    }
    static event_remove_user(id) {
        var element = document.getElementById(`checkDelUser${id}`);
        console.log(element);
        if (element.checked && !User.temp_remove.includes(id)) {
            User.list.forEach(checkID => {
                if (checkID.id == id) {
                    checkID.check = true
                    // console.log(checkID)
                }
            });
            User.temp_remove.push(id);
        }
        else {
            User.list.forEach(checkID => {
                if (checkID.id == id) {
                    checkID.check = false
                    // console.log(checkID)

                }
            });


            User.temp_remove.forEach(idd => {
                if (id != idd) {
                    User.eleListe.push(idd)
                }
            });
            User.temp_remove = User.eleListe
            User.eleListe = []
        }
        console.log(User.temp_remove);
    };


    static async removeFromListLogik(list, temp_remove) {
        // DIese Methode wird aufgerufen sobald wir auf Minus (-) klicken
        // Hier benötigen wir die Aktuellen IDS der Datenbank zum löschen
        console.log(list);
        temp_remove.forEach(id => {
            list = Crud.removeFromListViaID(id, list);

        });
        temp_remove = []
        console.log(list);
    }
    static removeFromListViaID(id, list) {
        var temp = [];
        console.log(list);
        list.forEach(element => {
            if (element.id != id) {
                //ID muss aus Liste gelöscht werden
                temp.push(element);
            } else {
                Crud.deletee(element.id, "deleteUser");
                console.log("Das Element wurde gefunden und wird gelöscht! " + element.id);
            }
        });
        return temp;
    }
    static async remove_generate(temp_remove, list) {
        if (temp_remove.length == 0) {
            alert("Bitte wählen Sie mindestens ein Users aus, um es zu löschen.");
            return;
        }
        const confirmed = confirm(`Sind Sie sicher, dass Sie ${temp_remove.length} User(s) löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.`);
        if (!confirmed) {
            console.log("Löschvorgang vom Benutzer abgebrochen");
            return; // Benutzer hat abgebrochen
        }
        await Crud.removeFromListLogik(list, temp_remove);
        await User.update();
    }

    static async add_user() {
        debugger
        var username = document.getElementById("username");
        var password = document.getElementById("password");
        var is_admin = document.getElementById("isAdmin");
        console.log(is_admin);
        if (username.value === "" || password.value === "") {
            alert("Bitte füllen Sie alle Felder aus.");
            return;
        }
        const response = await fetch('../database/insertUser.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username.value, password: password.value, is_admin: is_admin.value })
        });
        const data = await response.text();
        console.log('Response Text:', data); // Debug-Ausgabe des rohen Antworttexts
        if (data) {
            console.log('User erfolgreich hinzugefügt:', data);
            alert('User erfolgreich hinzugefügt');
            await User.update(); // Aktualisieren der Benutzerliste
            // Formular zurücksetzen
        } else {
            console.error('Fehler beim Hinzufügen des Users:', response.statusText);
            alert('Fehler beim Hinzufügen des Users');
        }
        username.value = '';
        password.value = '';
        is_admin.selectedIndex = 1;
    }

}