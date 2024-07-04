document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-recette");
  const recettesListe = document.getElementById("recettes-liste");
  const confirmButton = document.getElementById("confirm-modification");
  let editIndex = null;

  function loadRecettes() {
    const recettes = JSON.parse(localStorage.getItem("recettes")) || [];
    recettesListe.innerHTML = "";
    recettes.forEach((recette, index) => {
      const li = document.createElement("li");
      li.classList.toggle(
        "incomplete",
        !recette.nom || !recette.ingredients || !recette.instructions
      );
      li.innerHTML = `
                ${
                  recette.photo
                    ? `<img src="${recette.photo}" alt="Photo de ${recette.nom}">`
                    : ""
                }
                <h3>${recette.nom || "Recette sans nom"}</h3>
                <p><strong>Ingrédients:</strong> ${
                  recette.ingredients || "Ingrédients non spécifiés"
                }</p>
                <p><strong>Instructions:</strong> ${
                  recette.instructions || "Instructions non spécifiées"
                }</p>
                <div class="recette-actions">
                    <button class="modify" onclick="modifierRecette(${index})">Modifier</button>
                    <button onclick="supprimerRecette(${index})">Supprimer</button>
                </div>
            `;
      recettesListe.appendChild(li);
    });
  }

  function saveRecettes(recettes) {
    localStorage.setItem("recettes", JSON.stringify(recettes));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const nom = form.nom.value;
    const ingredients = form.ingredients.value;
    const instructions = form.instructions.value;
    const photoInput = form.photo.files[0];

    const recettes = JSON.parse(localStorage.getItem("recettes")) || [];

    if (photoInput) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const photo = e.target.result;
        if (editIndex === null) {
          recettes.push({ nom, ingredients, instructions, photo });
        } else {
          recettes[editIndex] = { nom, ingredients, instructions, photo };
          editIndex = null;
          confirmButton.style.display = "none";
          form.querySelector('button[type="submit"]').style.display = "block";
        }
        saveRecettes(recettes);
        loadRecettes();
        form.reset();
      };
      reader.readAsDataURL(photoInput);
    } else {
      if (editIndex === null) {
        recettes.push({ nom, ingredients, instructions, photo: null });
      } else {
        recettes[editIndex] = {
          nom,
          ingredients,
          instructions,
          photo: recettes[editIndex].photo,
        };
        editIndex = null;
        confirmButton.style.display = "none";
        form.querySelector('button[type="submit"]').style.display = "block";
      }
      saveRecettes(recettes);
      loadRecettes();
      form.reset();
    }
  });

  confirmButton.addEventListener("click", function () {
    const recettes = JSON.parse(localStorage.getItem("recettes")) || [];
    const photoInput = form.photo.files[0];
    if (photoInput) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const photo = e.target.result;
        recettes[editIndex] = {
          nom: form.nom.value,
          ingredients: form.ingredients.value,
          instructions: form.instructions.value,
          photo,
        };
        saveRecettes(recettes);
        loadRecettes();
        form.reset();
        editIndex = null;
        confirmButton.style.display = "none";
        form.querySelector('button[type="submit"]').style.display = "block";
      };
      reader.readAsDataURL(photoInput);
    } else {
      recettes[editIndex] = {
        nom: form.nom.value,
        ingredients: form.ingredients.value,
        instructions: form.instructions.value,
        photo: recettes[editIndex].photo,
      };
      saveRecettes(recettes);
      loadRecettes();
      form.reset();
      editIndex = null;
      confirmButton.style.display = "none";
      form.querySelector('button[type="submit"]').style.display = "block";
    }
  });

  window.supprimerRecette = function (index) {
    const recettes = JSON.parse(localStorage.getItem("recettes")) || [];
    recettes.splice(index, 1);
    saveRecettes(recettes);
    loadRecettes();
  };

  window.modifierRecette = function (index) {
    const recettes = JSON.parse(localStorage.getItem("recettes")) || [];
    const recette = recettes[index];
    form.nom.value = recette.nom;
    form.ingredients.value = recette.ingredients;
    form.instructions.value = recette.instructions;
    form.photo.value = "";
    editIndex = index;
    confirmButton.style.display = "block";
    form.querySelector('button[type="submit"]').style.display = "none";
  };

  loadRecettes();
});
