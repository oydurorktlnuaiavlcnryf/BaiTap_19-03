//HTTP request Get,post,put,delete
async function Load() {
    try {
        let res = await fetch('http://localhost:3000/posts')
        let data = await res.json();
        let body = document.getElementById("table-body");
        body.innerHTML = "";
        for (const post of data) {
            body.innerHTML += `
            <tr>
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td><input value="Delete" type="submit" onclick="Delete(${post.id})" /></td>
            </tr>`
        }
    } catch (error) {

    }
}
async function Save() {
    let id = document.getElementById("id_txt").value;
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("views_txt").value;
    let res;
    let getID = await fetch('http://localhost:3000/posts/' + id);
    if (getID.ok) {
        res = await fetch('http://localhost:3000/posts/'+id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    title: title,
                    views: views
                }
            )
        })
    } else {
        res = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    id: id,
                    title: title,
                    views: views
                }
            )
        })
    }
    if (res.ok) {
        console.log("them thanh cong");
    }
}
async function Delete(id) {
    let res = await fetch('http://localhost:3000/posts/' + id,
        {
            method: 'delete'
        }
    );
    if (res.ok) {
        console.log("xoa thanh cong");
    }
}
Load();
