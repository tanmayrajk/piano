const whiteKeys = document.getElementsByClassName("white");
const whiteKeysArr = Array.prototype.slice.call(whiteKeys);
const blackKeys = document.getElementsByClassName("black");
const whiteKeysMap = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
const blackKeysMap = ['q', 'e', 'r', 'i', 'o'];

function findBlackPosition(key) {
    const startKeyFunc = (el) => el.id == key.id[0];
    const startKey = whiteKeys[whiteKeysArr.findIndex(startKeyFunc)]
    const endKeyFunc = (el) => el.id == startKey.id[0];
    const endKey = whiteKeys[whiteKeysArr.findIndex(endKeyFunc) + 1]
    const endKeyPos = endKey.getBoundingClientRect().left;
    const keyWidth = key.getBoundingClientRect().right - key.getBoundingClientRect().left;
    const desiredPos = endKeyPos - keyWidth / 2;
    return desiredPos;
}

function arrangeBlackKeys() {
    for (let i = 0; i < blackKeys.length; i++) {
        const key = blackKeys[i];
        key.style.left = `${findBlackPosition(key)}px`
    }
}

arrangeBlackKeys()

window.onresize = arrangeBlackKeys;

// const synth = new Tone.Synth().toDestination();

const sampler = new Tone.Sampler({
	urls: {
		"C4": "C4.mp3",
		"D#4": "Ds4.mp3",
		"F#4": "Fs4.mp3",
		"A4": "A4.mp3",
	},
	release: 1,
	baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

Tone.loaded().then(() => {
	console.log("Sampler Loaded!")
})

function keyDown(key, note, h) {
    const now = Tone.now()
    sampler.triggerAttack(note, now)
    key.style.height = `${h}px`;
}

function keyUp(key, h) {
    const now = Tone.now()
    sampler.triggerRelease(now)
    key.style.height = `${h}px`;
}

for (let i = 0; i < whiteKeysArr.length; i++) {
    const key = whiteKeys[i];
    const note = key.id == "a"  || key.id == "b" ? `${key.id[0].toUpperCase()}3` : `${key.id[0].toUpperCase()}4`
    
    key.addEventListener("mousedown", () => {
        keyDown(key, note, 195)
    })
    key.addEventListener("mouseup", () => {
        keyUp(key, 200)
    })
    key.addEventListener("touchstart", e => {
        keyDown(key, note, 195)
    })
    key.addEventListener("touchend", e => {
        keyUp(key, 200)
    })
}

for (let i = 0; i < blackKeys.length; i++) {
    const key = blackKeys[i];
    const note = key.id == "as" ? `${key.id[0].toUpperCase()}#3` : `${key.id[0].toUpperCase()}#4`
    key.addEventListener("mousedown", () => {
        keyDown(key, note, 115)
    })
    key.addEventListener("mouseup", () => {
        keyUp(key, 120)
    })
}

let keyDownFlag = {};

window.addEventListener("keydown", (e) => {
    if (keyDownFlag[e.key]) {
        return
    }
    keyDownFlag[e.key] = true

    if (whiteKeysMap.includes(e.key)) {
        const key = whiteKeys[whiteKeysMap.indexOf(e.key)]
        const note = key.id == "a"  || key.id == "b" ? `${key.id[0].toUpperCase()}3` : `${key.id[0].toUpperCase()}4`
        keyDown(key, note, 195)
    } else if (blackKeysMap.includes(e.key) && !e.repeat) {
        const key = blackKeys[blackKeysMap.indexOf(e.key)]
        const note = key.id == "as" ? `${key.id[0].toUpperCase()}#3` : `${key.id[0].toUpperCase()}#4`
        keyDown(key, note, 115)
    }
})

window.addEventListener("keyup", (e) => {
    keyDownFlag[e.key] = false;
    if (whiteKeysMap.includes(e.key)) {
        const key = whiteKeys[whiteKeysMap.indexOf(e.key)]
        keyUp(key, 200)
    } else if (blackKeysMap.includes(e.key)) {
        const key = blackKeys[blackKeysMap.indexOf(e.key)]
        keyUp(key, 120)
    }
})


