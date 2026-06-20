const mode = document.getElementById('mode');
const provinceSelect = document.getElementById('provinceSelect');
const listContainer = document.getElementById('listContainer');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const mainTitle = document.getElementById('mainTitle');

let provinceData = {};

init();

async function init() {

    provinceData = await fetch(
        'data/provinces.json'
    ).then(r => r.json());

    loadProvinces();

    mode.value = 'philippines';

    provinceSelect.style.display = 'none';

    loadPhilippines();
}

mode.addEventListener('change', () => {

    if(mode.value === 'philippines'){

        provinceSelect.style.display = 'none';

        loadPhilippines();

    }else{

        provinceSelect.style.display = 'block';

        loadProvince();
    }
});

provinceSelect.addEventListener(
    'change',
    loadProvince
);

function loadProvinces(){

    const provinces =
        Object.keys(provinceData)
        .sort();

    provinceSelect.innerHTML = '';

    provinces.forEach(province => {

        provinceSelect.innerHTML += `
            <option value="${province}">
                ${province}
            </option>
        `;
    });
}

function loadPhilippines(){

    mainTitle.innerText =
        'PHILIPPINES';

    listContainer.classList.add(
        'philippines-mode'
    );

    const provinces =
        Object.keys(provinceData)
        .sort();

    renderList(provinces);
}

function loadProvince(){

    listContainer.classList.remove(
        'philippines-mode'
    );

    const province =
        provinceSelect.value;

    mainTitle.innerText =
        province;

    let municipalities =
        provinceData[province];

    if(!municipalities){

        municipalities = [];
    }

    renderList(municipalities);
}

function renderList(items){

    listContainer.innerHTML = '';

    items.forEach(name => {

        const key =
            `bucket_${name}`;

        const checked =
            localStorage.getItem(key) === '1';

        listContainer.innerHTML += `
            <div class="item ${checked ? 'checked' : ''}">
                <input
                    type="checkbox"
                    data-key="${key}"
                    ${checked ? 'checked' : ''}
                >

                <span>${name}</span>
            </div>
        `;
    });

    bindCheckboxes();

    updateProgress();
}

function bindCheckboxes(){

    document
    .querySelectorAll('.item input')
    .forEach(cb => {

        cb.addEventListener(
            'change',
            () => {

                localStorage.setItem(
                    cb.dataset.key,
                    cb.checked ? '1' : '0'
                );

                cb.parentElement
                .classList.toggle(
                    'checked',
                    cb.checked
                );

                updateProgress();
            }
        );
    });
}

function updateProgress(){

    const all = [
        ...document.querySelectorAll(
            '.item input'
        )
    ];

    const checked =
        all.filter(
            x => x.checked
        );

    const percent =
        all.length
        ?
        Math.round(
            checked.length /
            all.length *
            100
        )
        :
        0;

    progressText.innerText =
        `${checked.length} / ${all.length} Completed (${percent}%)`;

    progressFill.style.width =
        percent + '%';
}

document
.getElementById('downloadBtn')
.addEventListener(
    'click',
    async () => {

        const canvas =
        await html2canvas(
            document.getElementById(
                'poster'
            ),
            {
                scale:4,
                useCORS:true
            }
        );

        const link =
            document.createElement('a');

        link.download =
            'bucket-list.jpg';

        link.href =
            canvas.toDataURL(
                'image/jpeg',
                1
            );

        link.click();
    }
);