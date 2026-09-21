document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // FRONTEND DEMO ROOM DATA
  // ============================================

  const rooms = [
    {
      id: 'ROOM001',
      home: 'HOME001',
      name: 'Living Room',
      floor: 'Ground',
      usage: 'Living Room',
      status: 'Optimal'
    },
    {
      id: 'ROOM002',
      home: 'HOME001',
      name: 'Master Bedroom',
      floor: 'First',
      usage: 'Bedroom',
      status: 'Optimal'
    },
    {
      id: 'ROOM003',
      home: 'HOME001',
      name: 'Kitchen',
      floor: 'Ground',
      usage: 'Kitchen',
      status: 'Attention'
    },
    {
      id: 'ROOM004',
      home: 'HOME003',
      name: 'Open Office',
      floor: 'Second',
      usage: 'Office',
      status: 'Optimal'
    }
  ];


  // ============================================
  // HOME NAMES
  // ============================================

  const homeNames = {
    HOME001: 'Green Residency',
    HOME002: 'Wellness Villa',
    HOME003: 'Smart Habitat'
  };


  // ============================================
  // DOM ELEMENTS
  // ============================================

  const roomCards =
    document.getElementById('roomCards');

  const roomTableBody =
    document.getElementById('roomTableBody');

  const emptyState =
    document.getElementById('emptyState');

  const search =
    document.getElementById('globalSearch');

  const addRoomBtn =
    document.getElementById('addRoomBtn');

  const overlay =
    document.getElementById('roomOverlay');

  const closeModal =
    document.getElementById('closeModal');

  const cancelModal =
    document.getElementById('cancelModal');

  const saveRoom =
    document.getElementById('saveRoom');

  const modalTitle =
    document.getElementById('modalTitle');

  const roomName =
    document.getElementById('roomName');

  const roomHome =
    document.getElementById('roomHome');

  const roomFloor =
    document.getElementById('roomFloor');

  const roomUsage =
    document.getElementById('roomUsage');

  const roomStatus =
    document.getElementById('roomStatus');


  // ============================================
  // EDIT STATE
  // ============================================

  let editingId = null;


  // ============================================
  // ROOM ICON
  // ============================================

  const roomIcon = `
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="1.5"
      ></rect>

      <path d="M3 10h18"></path>

      <path d="M9 20v-6"></path>
    </svg>
  `;


  // ============================================
  // EDIT ICON
  // ============================================

  const editIcon = `
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M12 20h9"></path>

      <path
        d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
      ></path>
    </svg>
  `;


  // ============================================
  // DELETE ICON
  // ============================================

  const deleteIcon = `
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M3 6h18"></path>

      <path
        d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"
      ></path>

      <path d="M5 6l1 14h12l1-14"></path>
    </svg>
  `;


  // ============================================
  // ESCAPE HTML
  // ============================================

  function escapeHtml(value) {

    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

  }


  // ============================================
  // CARD STATUS
  // ============================================

  function statusCard(status) {

    if (status === 'Attention') {

      return `
        <span class="status-badge status-attention">

          <span class="dot"></span>

          Attention

        </span>
      `;

    }

    return `
      <span class="status-badge status-optimal">

        <span class="dot"></span>

        Optimal

      </span>
    `;

  }


  // ============================================
  // TABLE STATUS
  // ============================================

  function statusTable(status) {

    if (status === 'Attention') {

      return `
        <span class="table-status attention">

          <i></i>

          Attention

        </span>
      `;

    }

    return `
      <span class="table-status optimal">

        <i></i>

        Optimal

      </span>
    `;

  }


  // ============================================
  // RENDER ROOMS
  // ============================================

  function render(list) {

    // ----------------------------------------
    // ROOM CARDS
    // ----------------------------------------

    roomCards.innerHTML = list
      .map((room, index) => `

        <article
          class="room-card ${index === 0 ? 'selected' : ''}"
        >

          <div class="room-icon">
            ${roomIcon}
          </div>


          <div class="room-name">
            ${escapeHtml(room.name)}
          </div>


          <div class="room-meta">

            ${escapeHtml(
              homeNames[room.home] || room.home
            )}

            ·

            ${escapeHtml(room.floor)}
            Floor

          </div>


          ${statusCard(room.status)}

        </article>

      `)
      .join('');


    // ----------------------------------------
    // ROOM TABLE
    // ----------------------------------------

    roomTableBody.innerHTML = list
      .map(room => `

        <tr
          data-search="${escapeHtml(
            `${room.id}
             ${room.home}
             ${homeNames[room.home] || ''}
             ${room.name}
             ${room.floor}
             ${room.usage}
             ${room.status}`
              .toLowerCase()
          )}"
        >

          <td class="room-id">

            ${escapeHtml(room.id)}

          </td>


          <td class="cell-dim">

            ${escapeHtml(
              homeNames[room.home] || room.home
            )}

          </td>


          <td class="cell-strong">

            ${escapeHtml(room.name)}

          </td>


          <td>

            ${escapeHtml(room.floor)}

          </td>


          <td>

            ${escapeHtml(room.usage)}

          </td>


          <td>

            ${statusTable(room.status)}

          </td>


          <td>

            <div class="row-actions">


              <!-- EDIT -->

              <button
                class="table-action edit"
                type="button"
                data-id="${escapeHtml(room.id)}"
                title="Edit Room"
              >

                ${editIcon}

              </button>


              <!-- DELETE -->

              <button
                class="table-action delete"
                type="button"
                data-id="${escapeHtml(room.id)}"
                title="Delete Room"
              >

                ${deleteIcon}

              </button>


            </div>

          </td>

        </tr>

      `)
      .join('');


    // ----------------------------------------
    // EMPTY STATE
    // ----------------------------------------

    emptyState.style.display =
      list.length
        ? 'none'
        : 'block';


    // ----------------------------------------
    // BIND ACTIONS
    // ----------------------------------------

    attachActions();

  }


  // ============================================
  // TABLE ACTION EVENTS
  // ============================================

  function attachActions() {

    // EDIT BUTTONS

    roomTableBody
      .querySelectorAll('.edit')
      .forEach(btn => {

        btn.addEventListener(
          'click',
          () => {

            editRoom(
              btn.dataset.id
            );

          }
        );

      });


    // DELETE BUTTONS

    roomTableBody
      .querySelectorAll('.delete')
      .forEach(btn => {

        btn.addEventListener(
          'click',
          () => {

            deleteRoom(
              btn.dataset.id
            );

          }
        );

      });

  }


  // ============================================
  // FILTER / SEARCH
  // ============================================

  function filterRooms() {

    const query =
      search.value
        .trim()
        .toLowerCase();


    const filtered =
      rooms.filter(room => {

        const text = `
          ${room.id}
          ${room.name}
          ${room.home}
          ${homeNames[room.home] || ''}
          ${room.floor}
          ${room.usage}
          ${room.status}
        `.toLowerCase();


        return (
          !query ||
          text.includes(query)
        );

      });


    render(filtered);

  }


  // ============================================
  // OPEN MODAL
  // ============================================

  function openModal() {

    overlay.classList.add('open');

    document.body.style.overflow =
      'hidden';

  }


  // ============================================
  // CLOSE MODAL
  // ============================================

  function hideModal() {

    overlay.classList.remove('open');

    document.body.style.overflow =
      '';

    editingId = null;

  }


  // ============================================
  // ADD ROOM
  // ============================================

  addRoomBtn.addEventListener(
    'click',
    () => {

      editingId = null;

      modalTitle.textContent =
        'Add Room';


      roomName.value =
        '';


      roomHome.value =
        'HOME001';


      roomFloor.value =
        'Ground';


      roomUsage.value =
        'Living Room';


      roomStatus.value =
        'Optimal';


      openModal();

    }
  );


  // ============================================
  // EDIT ROOM
  // ============================================

  function editRoom(id) {

    const room =
      rooms.find(
        item => item.id === id
      );


    if (!room) {
      return;
    }


    editingId = id;


    modalTitle.textContent =
      'Edit Room';


    roomName.value =
      room.name;


    roomHome.value =
      room.home;


    roomFloor.value =
      room.floor;


    roomUsage.value =
      room.usage;


    roomStatus.value =
      room.status;


    openModal();

  }


  // ============================================
  // DELETE ROOM
  // ============================================

  function deleteRoom(id) {

    const index =
      rooms.findIndex(
        item => item.id === id
      );


    if (index === -1) {
      return;
    }


    const room =
      rooms[index];


    const confirmed =
      window.confirm(
        `Delete ${room.name}?`
      );


    if (!confirmed) {
      return;
    }


    rooms.splice(
      index,
      1
    );


    filterRooms();

  }


  // ============================================
  // SAVE ROOM
  // ============================================

  saveRoom.addEventListener(
    'click',
    () => {

      const name =
        roomName.value.trim();


      if (!name) {

        roomName.focus();

        return;

      }


      // ----------------------------------------
      // EDIT EXISTING
      // ----------------------------------------

      if (editingId) {

        const room =
          rooms.find(
            item => item.id === editingId
          );


        if (room) {

          room.name =
            name;

          room.home =
            roomHome.value;

          room.floor =
            roomFloor.value;

          room.usage =
            roomUsage.value;

          room.status =
            roomStatus.value;

        }

      }


      // ----------------------------------------
      // ADD NEW
      // ----------------------------------------

      else {

        const next =
          rooms.reduce(
            (max, room) => {

              const number =
                parseInt(
                  room.id
                    .replace(
                      'ROOM',
                      ''
                    ),
                  10
                ) || 0;


              return Math.max(
                max,
                number
              );

            },
            0
          ) + 1;


        rooms.push({

          id:
            `ROOM${String(next).padStart(3, '0')}`,

          home:
            roomHome.value,

          name:
            name,

          floor:
            roomFloor.value,

          usage:
            roomUsage.value,

          status:
            roomStatus.value

        });

      }


      hideModal();

      filterRooms();

    }
  );


  // ============================================
  // CLOSE EVENTS
  // ============================================

  closeModal.addEventListener(
    'click',
    hideModal
  );


  cancelModal.addEventListener(
    'click',
    hideModal
  );


  overlay.addEventListener(
    'click',
    event => {

      if (
        event.target === overlay
      ) {

        hideModal();

      }

    }
  );


  document.addEventListener(
    'keydown',
    event => {

      if (
        event.key === 'Escape' &&
        overlay.classList.contains('open')
      ) {

        hideModal();

      }

    }
  );


  // ============================================
  // SEARCH EVENT
  // ============================================

  search.addEventListener(
    'input',
    filterRooms
  );


  // ============================================
  // LIVE SIMULATION SWITCH
  // ============================================

  const liveSwitch =
    document.getElementById(
      'liveSwitch'
    );


  liveSwitch.addEventListener(
    'click',
    () => {

      liveSwitch.classList.toggle(
        'on'
      );

    }
  );


  // ============================================
  // MOBILE SIDEBAR
  // ============================================

  const sidebar =
    document.getElementById(
      'sidebar'
    );


  const sidebarOverlay =
    document.getElementById(
      'sidebarOverlay'
    );


  const hamburger =
    document.getElementById(
      'hamburgerBtn'
    );


  if (hamburger) {

    hamburger.addEventListener(
      'click',
      () => {

        sidebar.classList.add(
          'open'
        );

        sidebarOverlay.classList.add(
          'open'
        );

      }
    );

  }


  if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
      'click',
      () => {

        sidebar.classList.remove(
          'open'
        );

        sidebarOverlay.classList.remove(
          'open'
        );

      }
    );

  }


  // ============================================
  // INITIAL PAGE LOAD
  // ============================================

  render(rooms);

});