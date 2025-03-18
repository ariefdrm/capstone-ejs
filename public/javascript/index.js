/** @format */

function toggleEditForm(userId) {
  const form = document.getElementById(`edit-form-${userId}`);
  if (form.style.display === "none") {
    form.style.display = "block";
  } else {
    form.style.display = "none";
  }
}
