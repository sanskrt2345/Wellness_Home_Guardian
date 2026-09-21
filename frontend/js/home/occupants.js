/* ============================================================
   WELLNESS HOME GUARDIAN — OCCUPANTS
============================================================ */


/* ---------------- Icons (inline SVG, stroke style) ---------------- */

const ICONS = {

  shield:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5.5v6c0 5 3.4 8.6 8 10.5 4.6-1.9 8-5.5 8-10.5v-6L12 2Zm-1.2 13.6-3.2-3.2 1.4-1.4 1.8 1.8 4.2-4.2 1.4 1.4-5.6 5.6Z"/></svg>',

  dashboard:
    '<path d="M4 4h6v7H4zM14 4h6v4h-6zM14 12h6v8h-6zM4 15h6v5H4z"/>',

  home:
    '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/>',

  users:
    '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.4-3.4 3-5.5 6-5.5s5.6 2.1 6 5.5"/><path d="M16 5.2a3 3 0 0 1 0 5.6"/><path d="M18 14.8c1.7.7 2.8 2.3 3 4.7"/>',

  rooms:
    '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16"/>',

  sensor:
    '<circle cx="12" cy="12" r="2"/><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6M5.4 5.4a9.4 9.4 0 0 0 0 13.2M18.6 5.4a9.4 9.4 0 0 1 0 13.2"/>',

  chart:
    '<path d="M4 4v16h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',

  wind:
    '<path d="M3 8h11a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 12h16a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 16h7a2.5 2.5 0 1 1-2.5 2.5"/>',

  brain:
    '<path d="M8 4v16M12 7v10M16 4v16M4 9v6M20 9v6"/>',

  pulse:
    '<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>',

  leaf:
    '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-4 6-6 10-8"/>',

  bell:
    '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',

  search:
    '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/>',

  plus:
    '<path d="M12 5v14M5 12h14"/>',

  edit:
    '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',

  trash:
    '<path d="M4 7h16"/><path d="M9 7V4.5h6V7"/><path d="M6.5 7l1 13h9l1-13"/>',

  menu:
    '<path d="M4 7h16M4 12h16M4 17h16"/>'
};


/* ============================================================
   ICON FUNCTION
============================================================ */

function icon(name) {

  const raw =
    ICONS[name];


  if (!raw) {
    return '';
  }


  if (
    raw.startsWith('<svg')
  ) {

    return raw;

  }


  return `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      ${raw}
    </svg>
  `;
}


/* ============================================================
   APPLY DATA ICONS
============================================================ */

document
  .querySelectorAll('[data-icon]')
  .forEach(
    element => {

      element.innerHTML =
        icon(
          element.dataset.icon
        );

    }
  );


/* ============================================================
   ICON SIZES
============================================================ */

document
  .querySelectorAll(
    '.nav-item > span[data-icon] svg'
  )
  .forEach(
    svg => {

      svg.style.width =
        '18px';

      svg.style.height =
        '18px';

    }
  );


document
  .querySelectorAll(
    '.menu-btn svg'
  )
  .forEach(
    svg => {

      svg.style.width =
        '20px';

      svg.style.height =
        '20px';

    }
  );


document
  .querySelectorAll(
    '.global-search svg, .table-search svg'
  )
  .forEach(
    svg => {

      svg.style.width =
        '16px';

      svg.style.height =
        '16px';

      svg.style.flexShrink =
        '0';

    }
  );


/* ============================================================
   DATA
============================================================ */

let occupants = [

  {
    id: 'OCC001',
    name: 'Sarah Patel',
    age: 34,
    gender: 'Female',
    category: 'Asthma',
    home: 'Green Residency',
    status: 'Active'
  },

  {
    id: 'OCC002',
    name: 'David Lee',
    age: 67,
    gender: 'Male',
    category: 'Senior Citizen',
    home: 'Wellness Villa',
    status: 'Active'
  },

  {
    id: 'OCC003',
    name: 'John Smith',
    age: 29,
    gender: 'Male',
    category: 'Normal',
    home: 'Smart Habitat',
    status: 'Active'
  },

  {
    id: 'OCC004',
    name: 'Emma Wilson',
    age: 12,
    gender: 'Female',
    category: 'Allergy Sensitive',
    home: 'Green Residency',
    status: 'Active'
  }

];


let activeFilter =
  'All';


let searchTerm =
  '';


let editingId =
  null;


let deletingId =
  null;


/* ============================================================
   ELEMENTS
============================================================ */

const $ =
  id =>
    document.getElementById(id);


const tbody =
  $('tbody');


/* ============================================================
   HELPERS
============================================================ */

function esc(value) {

  return String(
    value ?? ''
  )
    .replace(
      /[&<>"']/g,
      character => ({

        '&':
          '&amp;',

        '<':
          '&lt;',

        '>':
          '&gt;',

        '"':
          '&quot;',

        "'":
          '&#39;'

      }[character])
    );

}


function nextId() {

  const max =
    occupants.reduce(
      (
        maximum,
        occupant
      ) => {

        const number =
          parseInt(
            occupant.id.replace(
              /\D/g,
              ''
            ),
            10
          ) || 0;


        return Math.max(
          maximum,
          number
        );

      },
      0
    );


  return (
    'OCC' +
    String(
      max + 1
    ).padStart(
      3,
      '0'
    )
  );

}


/* ============================================================
   TOAST
============================================================ */

let toastTimer;


function toast(
  message
) {

  const element =
    $('toast');


  if (!element) {
    return;
  }


  element.textContent =
    message;


  element.classList.add(
    'show'
  );


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(
      () => {

        element.classList.remove(
          'show'
        );

      },
      2400
    );

}


/* ============================================================
   RENDER TABLE
============================================================ */

function render() {

  if (!tbody) {
    return;
  }


  const query =
    searchTerm
      .trim()
      .toLowerCase();


  const list =
    occupants.filter(
      occupant => {

        const matchCategory =
          activeFilter ===
            'All' ||
          occupant.category ===
            activeFilter;


        const searchText = [

          occupant.id,

          occupant.name,

          occupant.age,

          occupant.gender,

          occupant.category,

          occupant.home,

          occupant.status

        ]
          .join(' ')
          .toLowerCase();


        const matchSearch =
          !query ||
          searchText.includes(
            query
          );


        return (
          matchCategory &&
          matchSearch
        );

      }
    );


  tbody.innerHTML =
    list
      .map(
        occupant => `

          <tr>

            <td>

              <span class="occ-id">

                ${esc(
                  occupant.id
                )}

              </span>

            </td>


            <td>

              <span class="occ-name">

                ${esc(
                  occupant.name
                )}

              </span>

            </td>


            <td>

              <span class="occ-age">

                ${esc(
                  occupant.age
                )}

              </span>

            </td>


            <td>

              ${esc(
                occupant.gender
              )}

            </td>


            <td>

              <span class="cat-pill">

                ${esc(
                  occupant.category
                )}

              </span>

            </td>


            <td>

              <span class="occ-home">

                ${esc(
                  occupant.home
                )}

              </span>

            </td>


            <td>

              <span
                class="status ${
                  occupant.status ===
                  'Active'
                    ? 'active'
                    : 'inactive'
                }"
              >

                ${esc(
                  occupant.status
                )}

              </span>

            </td>


            <td>

              <div class="actions">

                <button
                  class="icon-btn sm"
                  type="button"
                  data-edit="${esc(
                    occupant.id
                  )}"
                  aria-label="Edit ${esc(
                    occupant.name
                  )}"
                  title="Edit"
                >

                  ${icon('edit')}

                </button>


                <button
                  class="icon-btn sm danger"
                  type="button"
                  data-del="${esc(
                    occupant.id
                  )}"
                  aria-label="Delete ${esc(
                    occupant.name
                  )}"
                  title="Delete"
                >

                  ${icon('trash')}

                </button>

              </div>

            </td>

          </tr>

        `
      )
      .join('');


  const empty =
    $('empty');


  if (empty) {

    empty.hidden =
      list.length >
      0;

  }

}


/* ============================================================
   FILTER BUTTONS
============================================================ */

const chips =
  $('chips');


if (chips) {

  chips.addEventListener(
    'click',
    event => {

      const chip =
        event.target.closest(
          '.chip'
        );


      if (!chip) {
        return;
      }


      activeFilter =
        chip.dataset.filter;


      document
        .querySelectorAll(
          '.chip'
        )
        .forEach(
          item => {

            item.classList.toggle(
              'active',
              item === chip
            );

          }
        );


      render();

    }
  );

}


/* ============================================================
   SEARCH
============================================================ */

function onSearch(
  value,
  source
) {

  searchTerm =
    value;


  const tableSearch =
    $('tableSearch');


  const globalSearch =
    $('globalSearch');


  if (
    source !==
      'table' &&
    tableSearch
  ) {

    tableSearch.value =
      value;

  }


  if (
    source !==
      'global' &&
    globalSearch
  ) {

    globalSearch.value =
      value;

  }


  render();

}


$('tableSearch')
  ?.addEventListener(
    'input',
    event => {

      onSearch(
        event.target.value,
        'table'
      );

    }
  );


$('globalSearch')
  ?.addEventListener(
    'input',
    event => {

      onSearch(
        event.target.value,
        'global'
      );

    }
  );


/* ============================================================
   ADD / EDIT FORM
============================================================ */

function openForm(
  id = null
) {

  editingId =
    id || null;


  const occupant =
    id
      ? occupants.find(
          item =>
            item.id === id
        )
      : null;


  if ($('formTitle')) {

    $('formTitle').textContent =
      occupant
        ? 'Edit Occupant'
        : 'Add Occupant';

  }


  if ($('saveForm')) {

    $('saveForm').textContent =
      occupant
        ? 'Save changes'
        : 'Save occupant';

  }


  $('inName').value =
    occupant
      ? occupant.name
      : '';


  $('inAge').value =
    occupant
      ? occupant.age
      : '';


  $('inGender').value =
    occupant
      ? occupant.gender
      : 'Female';


  $('inCat').value =
    occupant
      ? occupant.category
      : 'Normal';


  $('inHome').value =
    occupant
      ? occupant.home
      : 'Green Residency';


  $('inStatus').value =
    occupant
      ? occupant.status
      : 'Active';


  $('fName')
    ?.classList.remove(
      'invalid'
    );


  $('fAge')
    ?.classList.remove(
      'invalid'
    );


  $('formOverlay')
    ?.classList.add(
      'open'
    );


  setTimeout(
    () => {

      $('inName')
        ?.focus();

    },
    30
  );

}


function closeForm() {

  $('formOverlay')
    ?.classList.remove(
      'open'
    );


  editingId =
    null;

}


/* ============================================================
   SAVE FORM
============================================================ */

function saveForm() {

  const name =
    $('inName')
      ?.value
      .trim() ||
    '';


  const age =
    parseInt(
      $('inAge')
        ?.value,
      10
    );


  const nameOk =
    name.length >
    0;


  const ageOk =
    Number.isFinite(age) &&
    age >= 0 &&
    age <= 120;


  $('fName')
    ?.classList.toggle(
      'invalid',
      !nameOk
    );


  $('fAge')
    ?.classList.toggle(
      'invalid',
      !ageOk
    );


  if (
    !nameOk ||
    !ageOk
  ) {

    return;

  }


  const data = {

    name,

    age,

    gender:
      $('inGender')
        ?.value ||
      'Female',

    category:
      $('inCat')
        ?.value ||
      'Normal',

    home:
      $('inHome')
        ?.value ||
      'Green Residency',

    status:
      $('inStatus')
        ?.value ||
      'Active'

  };


  /* EDIT */

  if (editingId) {

    const index =
      occupants.findIndex(
        item =>
          item.id ===
          editingId
      );


    if (
      index !==
      -1
    ) {

      occupants[index] = {

        ...occupants[index],

        ...data

      };


      toast(
        'Changes saved'
      );

    }

  }

  /* ADD */

  else {

    occupants.push({

      id:
        nextId(),

      ...data

    });


    toast(
      'Occupant added'
    );

  }


  closeForm();

  render();

}


/* ============================================================
   ADD BUTTON
============================================================ */

$('addBtn')
  ?.addEventListener(
    'click',
    () => {

      openForm();

    }
  );


/* ============================================================
   FORM BUTTONS
============================================================ */

$('cancelForm')
  ?.addEventListener(
    'click',
    closeForm
  );


$('saveForm')
  ?.addEventListener(
    'click',
    saveForm
  );


$('formOverlay')
  ?.addEventListener(
    'keydown',
    event => {

      if (
        event.key ===
          'Enter' &&
        event.target.tagName !==
          'BUTTON'
      ) {

        saveForm();

      }

    }
  );


/* ============================================================
   DELETE
============================================================ */

if (tbody) {

  tbody.addEventListener(
    'click',
    event => {

      const editButton =
        event.target.closest(
          '[data-edit]'
        );


      const deleteButton =
        event.target.closest(
          '[data-del]'
        );


      /* EDIT */

      if (editButton) {

        openForm(
          editButton.dataset.edit
        );

        return;

      }


      /* DELETE */

      if (deleteButton) {

        deletingId =
          deleteButton.dataset.del;


        const occupant =
          occupants.find(
            item =>
              item.id ===
              deletingId
          );


        if (occupant) {

          const text =
            $('delText');


          if (text) {

            text.textContent =
              `${occupant.name} (${occupant.id}) will be removed from the occupant list.`;

          }

        }


        $('delOverlay')
          ?.classList.add(
            'open'
          );

      }

    }
  );

}


/* ============================================================
   CLOSE DELETE
============================================================ */

function closeDel() {

  $('delOverlay')
    ?.classList.remove(
      'open'
    );


  deletingId =
    null;

}


$('cancelDel')
  ?.addEventListener(
    'click',
    closeDel
  );


/* ============================================================
   CONFIRM DELETE
============================================================ */

$('confirmDel')
  ?.addEventListener(
    'click',
    () => {

      if (!deletingId) {
        return;
      }


      occupants =
        occupants.filter(
          occupant =>
            occupant.id !==
            deletingId
        );


      closeDel();


      render();


      toast(
        'Occupant deleted'
      );

    }
  );


/* ============================================================
   CLOSE MODAL ON BACKDROP
============================================================ */

[
  'formOverlay',
  'delOverlay'
]
.forEach(
  id => {

    const overlay =
      $(id);


    if (!overlay) {
      return;
    }


    overlay.addEventListener(
      'mousedown',
      event => {

        if (
          event.target ===
          overlay
        ) {

          overlay.classList.remove(
            'open'
          );


          if (
            id ===
            'formOverlay'
          ) {

            editingId =
              null;

          }


          if (
            id ===
            'delOverlay'
          ) {

            deletingId =
              null;

          }

        }

      }
    );

  }
);


/* ============================================================
   ESCAPE KEY
============================================================ */

document.addEventListener(
  'keydown',
  event => {

    if (
      event.key !==
      'Escape'
    ) {

      return;

    }


    closeForm();

    closeDel();

    closeSidebar();

  }
);


/* ============================================================
   MOBILE SIDEBAR
============================================================ */

const sidebar =
  $('sidebar');


function closeSidebar() {

  sidebar
    ?.classList.remove(
      'open'
    );

}


$('menuBtn')
  ?.addEventListener(
    'click',
    () => {

      sidebar
        ?.classList.toggle(
          'open'
        );

    }
  );


$('scrim')
  ?.addEventListener(
    'click',
    closeSidebar
  );


/* ============================================================
   LIVE SIMULATION
============================================================ */

$('liveToggle')
  ?.addEventListener(
    'change',
    event => {

      toast(
        event.target.checked
          ? 'Live simulation is on'
          : 'Live simulation is off'
      );

    }
  );


/* ============================================================
   NOTIFICATION
============================================================ */

$('bellBtn')
  ?.addEventListener(
    'click',
    () => {

      toast(
        'You have 4 new alerts'
      );

    }
  );


/* ============================================================
   NAVIGATION
   IMPORTANT:
   Dashboard / Home Registry / Occupants / Rooms
   navigate normally.

   Only links with data-soon are blocked.
============================================================ */

document
  .querySelectorAll(
    '.nav-item'
  )
  .forEach(
    link => {

      link.addEventListener(
        'click',
        event => {

          const href =
            link.getAttribute(
              'href'
            );


          const isSoon =
            link.hasAttribute(
              'data-soon'
            );


          /*
             REAL PAGE LINK
             Let browser navigate normally.
          */

          if (
            href &&
            href !== '#' &&
            !isSoon
          ) {

            closeSidebar();

            return;

          }


          /*
             COMING SOON PAGE
          */

          if (isSoon) {

            event.preventDefault();


            toast(
              link.dataset.soon ||
              'This page is coming soon'
            );


            closeSidebar();

            return;

          }


          /*
             EMPTY # LINK
          */

          if (
            !href ||
            href === '#'
          ) {

            event.preventDefault();

          }

        }
      );

    }
  );


/* ============================================================
   INITIAL RENDER
============================================================ */

render();