// Lista inicial de comentarios
let comments = [
  { user: "Mauricio", text: "Muy buen juego!", likes: 3 },
  { user: "Juan Carlos", text: "No me convenció mucho...", likes: 1 },
  { user: "Luis", text: "Esperaba más.", likes: 0 },
  { user: "Monica", text: "Excelente jugabilidad", likes: 5 },
  { user: "Ester", text: "Recomendado!", likes: 2 },
  { user: "Javier", text: "Podría mejorar los gráficos", likes: 0 },
];

const commentsList = document.getElementById("comments-list");
const loadMoreBtn = document.getElementById("load-more");
let inputBox = document.querySelector(".input-container .input-placeholder");
const placeholderText = inputBox.textContent;// Texto placeholder del input

let visibleCount = 3;  // Cantidad inicial de comentarios visibles

// Renderizar lista
function renderComments() {
  commentsList.innerHTML = "";

// comments.slice(0, visibleCount) -->Toma un subconjunto del array comments, desde el índice 0 hasta visibleCount (sin incluirlo).
  comments.slice(0, visibleCount).forEach((comment, index) => {
    //itero y para cada comentario obtengo su index

    //creo el contenedor y le doy su clase
    const box = document.createElement("div");
    box.classList.add("comment-component");

    //defino el html dentro del div
    box.innerHTML = `
      <div class="input-container">
      <div class="alto">
        <div class="comment-header-section">
          <div class="profile-avatar">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="16" fill="#0B0B0D" />
              <g clip-path="url(#clip0_335_3206)">
                <path
                  d="M23.0279 16.331C22.7732 16.2157 22.5101 16.12 22.2409 16.0448C22.9189 15.7023 23.4082 15.366 23.0824 15.2215C22.7604 15.0785 22.4659 15.02 22.1969 15.0217C22.5667 14.596 22.7579 14.238 22.4987 14.1227C21.6022 13.7247 21.0044 14.2808 20.6179 15.0068C20.2649 12.832 19.3044 11.512 17.7064 11.0085C18.5917 9.89275 19.4339 9.32575 19.4427 9.31975L19.9062 9.0115L19.3649 8.8835C19.2797 8.86325 17.2554 8.40775 15.3904 9.99975C15.3741 10.0136 15.3581 10.0276 15.3424 10.0417C15.2507 9.41425 15.2642 9.01825 15.2644 9.0135L15.2839 8.5L14.8757 8.8125C14.8302 8.84725 13.8194 9.636 13.4889 11.1375C12.3457 10.822 11.4522 11.0233 11.4117 11.0325L10.8679 11.1595L11.3327 11.469C11.3374 11.4722 11.7919 11.7775 12.3789 12.374C11.8877 13.0423 11.5567 13.9127 11.3794 15.0027C10.9929 14.2787 10.3957 13.726 9.50117 14.123C9.24167 14.2383 9.43317 14.5963 9.80292 15.022C9.53417 15.0202 9.23942 15.0787 8.91742 15.2217C8.59167 15.3662 9.08092 15.7025 9.75892 16.0448C9.52142 16.1102 9.26092 16.2025 8.97167 16.3313C8.08617 16.7245 10.0622 16.9018 11.2284 16.9703C11.2279 17.022 11.2249 17.07 11.2249 17.123C11.2249 17.435 11.2569 17.7243 11.3189 17.9888L10.7807 18.1925L10.1039 16.9913C10.1039 16.9913 9.49817 17.4142 9.49817 18.2332C9.49817 21.1493 12.2632 23.5 15.9999 23.5C19.7367 23.5 22.5017 21.1493 22.5017 18.2332C22.5017 17.4145 21.8957 16.9913 21.8957 16.9913L21.2192 18.1925L20.6804 17.9885C20.7422 17.7242 20.7749 17.435 20.7749 17.123C20.7749 17.0705 20.7727 17.0218 20.7722 16.9703C21.9382 16.9015 23.9137 16.7243 23.0279 16.331ZM21.4364 18.7917L21.6402 18.4298L21.9562 17.869C21.9934 17.974 22.0182 18.0953 22.0182 18.2332C22.0182 20.9155 19.3747 23.017 15.9999 23.017C12.6252 23.017 9.98142 20.9155 9.98142 18.2332C9.98142 18.0953 10.0062 17.974 10.0437 17.869L10.3597 18.4298L10.5634 18.7917L10.9522 18.6442L12.2179 18.1643L13.7344 19.533L13.9662 19.7425L14.2522 19.617L15.9414 18.878L17.1894 19.7788L17.4887 19.995L17.7757 19.7633L19.7657 18.1578L21.0482 18.6442L21.4364 18.7917ZM19.6777 17.608L17.4719 19.387L15.9999 18.3247L14.0577 19.1745L12.3222 17.6077L11.7757 17.8147C11.7317 17.6035 11.7082 17.3723 11.7082 17.1225C11.7082 15.0143 12.1042 13.4622 12.8849 12.5097L13.0194 12.3455L12.8739 12.191C12.627 11.9285 12.3658 11.6798 12.0914 11.4462C12.6036 11.435 13.1139 11.5129 13.5994 11.6762L13.8719 11.7685L13.9159 11.4843C14.0544 10.5855 14.4834 9.93725 14.8012 9.565C14.8232 9.83675 14.8667 10.1945 14.9517 10.6145L15.0594 11.1448L15.3827 10.711C15.4765 10.5847 15.5845 10.4694 15.7044 10.3675C16.5312 9.6543 17.593 9.27298 18.6847 9.29725C18.2844 9.636 17.6919 10.2027 17.1017 11.0048L16.8834 11.3015L17.2424 11.3837C19.2944 11.8525 20.2922 13.7298 20.2922 17.123C20.2922 17.3728 20.2692 17.6045 20.2249 17.8155L19.6777 17.608Z"
                  fill="#FDF9FB"
                />
                <path
                  d="M15.9996 15.4915C15.4294 15.4915 14.9651 16.1405 14.9651 16.9377C14.9651 17.621 15.5019 18.044 15.9996 18.044C16.4974 18.044 17.0346 17.6212 17.0346 16.9377C17.0346 16.1405 16.5704 15.4915 15.9996 15.4915ZM15.9996 15.7332C16.3969 15.7332 16.7236 16.1802 16.7809 16.7595C16.6211 16.5887 16.3329 16.3402 15.9999 16.3402C15.6671 16.3402 15.3786 16.589 15.2189 16.7595C15.2759 16.1802 15.6026 15.7332 15.9996 15.7332ZM15.9996 17.8022C15.6524 17.8022 15.2839 17.5262 15.2201 17.074C15.3801 17.2445 15.6681 17.4912 15.9999 17.4912C16.3316 17.4912 16.6196 17.2445 16.7796 17.074C16.7159 17.526 16.3471 17.8022 15.9996 17.8022ZM18.2256 13.826C18.0195 13.7781 17.803 13.8062 17.6159 13.905C17.4351 13.9975 17.2974 14.1387 17.1926 14.2922C17.3504 14.185 17.5101 14.0897 17.6766 14.0295C17.8431 13.9705 18.0169 13.9555 18.1819 13.9965C18.3481 14.0335 18.5039 14.1215 18.6504 14.2252C18.7966 14.3302 18.9341 14.454 19.0791 14.5762C18.9916 14.4132 18.8871 14.255 18.7456 14.1225C18.6071 13.988 18.4319 13.876 18.2256 13.826ZM14.3841 13.905C14.1971 13.8057 13.9803 13.7776 13.7741 13.826C13.5686 13.876 13.3931 13.988 13.2546 14.1227C13.1134 14.2552 13.0086 14.4135 12.9216 14.5765C13.0661 14.4542 13.2041 14.3305 13.3499 14.2255C13.4969 14.1217 13.6526 14.0337 13.8189 13.9967C13.9834 13.9557 14.1571 13.9707 14.3239 14.0297C14.4906 14.09 14.6499 14.1852 14.8076 14.2925C14.7029 14.1387 14.5651 13.9975 14.3841 13.905ZM13.8644 15.2395C13.5574 15.2395 13.3089 15.559 13.3089 15.8582C13.3089 16.1575 13.5574 16.2887 13.8644 16.2887C14.1706 16.2887 14.4191 16.1577 14.4191 15.8582C14.4191 15.5587 14.1706 15.2395 13.8644 15.2395ZM18.1359 15.2395C17.8286 15.2395 17.5801 15.559 17.5801 15.8582C17.5801 16.1575 17.8286 16.2887 18.1359 16.2887C18.4421 16.2887 18.6909 16.1577 18.6909 15.8582C18.6909 15.5587 18.4421 15.2395 18.1359 15.2395Z"
                  fill="#FDF9FB"
                />
              </g>
              <defs>
                <clipPath id="clip0_335_3206">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(8 8)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <span class="user-name">${comment.user}</span>
          <div class="register-message" data-index="${index}">
            <span class="like-count opacity">${comment.likes}</span>
            <svg
              class="like-btn"
              width="26"
              height="24"
              viewBox="0 0 26 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.69381 0.75H7.67534L7.40304 1.665L4.99516 9.75H0.385254V23.25H19.8262L20.1425 22.416L25.0622 9.416L25.6926 7.75H14.8582V5.6C14.8582 4.3137 14.3104 3.08008 13.3353 2.17053C12.3602 1.26098 11.0377 0.75 9.65868 0.75H8.69381ZM7.30441 11.335L9.71228 3.25C10.3709 3.26307 10.9979 3.51629 11.4588 3.95537C11.9197 4.39446 12.1779 4.98448 12.178 5.599V10.249H21.9039L17.9308 20.749H7.0857V12.069L7.30441 11.335Z"
                fill="#FDF9FB"
              />
            </svg>
        </div>
      </div>
    </div>
    <div class="linea-divisora"></div>

    <!-- Caja de comentario -->
    <div class="bajo-comentario">
       <span class="input-placeholder">${comment.text}</div>
       </div>
  </div>
        `;

    //al div del html le indico que es padre de este nuevo div
    commentsList.appendChild(box);
  });

  // Oculta el botón "Ver más" si ya mostramos todos los comentarios
  loadMoreBtn.style.display =
    visibleCount >= comments.length ? "none" : "inline-block";

  // Agrega eventos de "like"
  document.querySelectorAll(".like-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      
      // obtengo el atributo data-index del elemento padre del botón.
      const idx = btn.parentElement.getAttribute("data-index");
      // Este índice (idx) indica la posición del comentario en el array comments.
      comments[idx].likes++;
      renderComments(); // Recarga la lista de comentarios actualizada
    });
  });

  // resetear inputBox al placeholder
  resetInputBox();
}

// muetro 3 comentarios mas al hacer click
loadMoreBtn.addEventListener("click", () => {
  visibleCount += 3;
  renderComments();//vuelvo a cargar la lista
});

// Función para inicializar input editable
function resetInputBox() {
  const parent = document.querySelector(".input-container .input-placeholder");
  const newInput = document.createElement("span");
  newInput.classList.add("input-placeholder");
  newInput.textContent = placeholderText;
  parent.innerHTML = "";
  parent.appendChild(newInput);
  inputBox = newInput; //inputBox ahora apunta a newInput

  // click para activar contenteditable
  inputBox.addEventListener("click", activateInput);
}

// Activar input editable
function activateInput(e) {
  const parent = inputBox.parentElement; //obtengo el elemento padre de inputBox

  const editable = document.createElement("div");
  editable.classList.add("input-placeholder");
  editable.setAttribute("contenteditable", "true"); //permito que pueda editar el usuario
  editable.style.outline = "none";
  editable.style.cursor = "text";
  editable.textContent = "";
  parent.replaceChild(editable, inputBox); //Reemplazo el actual (inputBox) con el nuevo
  editable.focus();

  // Enter agrega comentario
  editable.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && editable.textContent.trim() !== "") { //trim() quita espacios innecesarios
      e.preventDefault();
      comments.unshift({ //inserta al inicio del array comments con .unshift()
        user: "Tú",
        text: editable.textContent.trim(),
        likes: 0,
      });
      visibleCount++;
      renderComments(); // se resetea input
    }
  });

  // evento que se activa cuando el campo editable pierde el foco
  editable.addEventListener("blur", () => {
    if (!editable.textContent.trim()) { //si esta vacio
      resetInputBox(); //vuelvo al estado inicial
    }
  });
}

// inicializo la interfaz
renderComments();
