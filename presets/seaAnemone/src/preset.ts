import { ISourceOptions, tsParticles } from "tsparticles";
import { INoise } from "tsparticles/dist/Core/Interfaces/INoise";
import { IParticle } from "tsparticles/dist/Core/Interfaces/IParticle";

const presetName = "seaAnemone";
const noiseGeneratorName = "seaAnemoneNoise";

const options: ISourceOptions = {
    fpsLimit: 60,
    interactivity: {
        detectsOn: "canvas",
        events: {
            resize: true,
        },
    },
    particles: {
        color: {
            value: "#FF0000",
        },
        move: {
            attract: {
                enable: false,
                distance: 100,
                rotate: {
                    x: 2000,
                    y: 2000,
                },
            },
            direction: "none",
            enable: true,
            outModes: {
                default: "destroy",
            },
            noise: {
                clamp: false,
                enable: true,
                delay: {
                    value: 0,
                },
                generator: "seaAnemoneNoise",
            },
            random: false,
            speed: 1,
            straight: false,
            trail: {
                fillColor: "#000",
                length: 30,
                enable: true,
            },
        },
        number: {
            density: {
                enable: true,
                area: 800,
            },
            value: 0,
        },
        opacity: {
            value: 1,
        },
        shape: {
            type: "circle",
        },
        size: {
            value: 10,
            animation: {
                count: 1,
                startValue: "min",
                enable: true,
                minimumValue: 1,
                speed: 10,
                sync: true,
            },
        },
    },
    background: {
        color: "#000",
    },
    detectRetina: true,
    emitters: {
        direction: "none",
        rate: {
            quantity: 5,
            delay: 0.3,
        },
        size: {
            width: 0,
            height: 0,
            mode: "precise",
        },
        spawnColor: {
            value: "#ff0000",
            animation: {
                enable: true,
                speed: 10,
                sync: false,
            },
        },
        position: {
            x: 50,
            y: 50,
        },
    },
};

function NoiseGen(
    rndFunc: (() => number) | null,
    period: number,
    nbHarmonics: number,
    attenHarmonics: number,
    lowValue = 0,
    highValue = 1
): () => number {
    const arP0: number[] = []; // 'preceeding value' for each harmonic
    const arP1: number[] = []; // 'succeding value'
    const amplitudes: number[] = []; // amplitudes oh harmonics
    const increments: number[] = []; // n / period, wich will be added to phases for every point
    const phases: number[] = [];
    let globAmplitude = 0;
    const randomFunc = rndFunc ?? Math.random;

    if (nbHarmonics < 1) nbHarmonics = 1;

    for (let kh = 1; kh <= nbHarmonics; ++kh) {
        arP0[kh] = randomFunc();
        arP1[kh] = randomFunc();
        amplitudes[kh] = kh === 1 ? 1 : amplitudes[kh - 1] * attenHarmonics;
        globAmplitude += amplitudes[kh];
        increments[kh] = kh / period;
        phases[kh] = randomFunc();
    } // for kh

    /* normalize amplitudes */
    amplitudes.forEach((value, kh) => (amplitudes[kh] = (value / globAmplitude) * (highValue - lowValue)));

    /* returned function here */
    return function () {
        let pf, pfl;
        let signal = 0;
        for (let kh = nbHarmonics; kh >= 1; --kh) {
            pf = phases[kh] += increments[kh];
            if (phases[kh] >= 1) {
                pf = phases[kh] -= 1;
                arP0[kh] = arP1[kh];
                arP1[kh] = randomFunc();
            } // if full period reached
            pfl = pf * pf * (3 - 2 * pf); // always 0..1, but smoother
            signal += (arP0[kh] * (1 - pfl) + arP1[kh] * pfl) * amplitudes[kh];
        } // for kh
        return signal + lowValue;
    }; // returned function
} // NoiseGen

type SeaNoiseParticle = IParticle & {
    noiseGen?: () => number;
    seaDir?: number;
    seaSpeed?: number;
};

const seaNoiseGenerator: INoise = {
    init: () => {
        // do nothing
    },
    update: () => {
        // do nothing
    },
    generate: (p: SeaNoiseParticle) => {
        if (p.noiseGen === undefined) {
            p.noiseGen = NoiseGen(null, 100, 2, 0.8, -0.03, 0.03);
        }

        if (p.seaDir === undefined) {
            p.seaDir = Math.random() * Math.PI * 2;
        } else {
            p.seaDir = (p.seaDir + p.noiseGen()) % (Math.PI * 2);
        }

        if (p.seaSpeed === undefined) {
            p.seaSpeed = Math.random() * 0.6 + 0.8;
        } else {
            p.seaSpeed += 0.01;
        }

        p.velocity.horizontal = 0;
        p.velocity.vertical = 0;

        return {
            angle: p.seaDir,
            length: p.seaSpeed,
        };
    },
};

tsParticles.addPreset(presetName, options);
tsParticles.addNoiseGenerator(noiseGeneratorName, seaNoiseGenerator);