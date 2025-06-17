document.addEventListener('DOMContentLoaded', () => {
    const audioPlayerContainer = document.getElementById('audio-player-container');
    const currentAudio = document.getElementById('current-audio');

    // Array de áudios com base nos caminhos que você forneceu
    const audioFiles = [
        'audios/1- Sentido.mp3',
        'audios/2 - Descansar.mp3',
        'audios/3 - Cobrir.mp3',
        'audios/4 - Firme.mp3',
        'audios/5 - Esquerda Volver.mp3',
        'audios/6 - Direita Volver.mp3',
        'audios/7 - Meia Volta Volver.mp3',
        'audios/8 - Ombro.mp3',
        'audios/9 - Descansar Arma.mp3',
        'audios/10 - Apresentar Arma.mp3',
        'audios/11 - Ordinário Marche.mp3',
        'audios/12 - Alto.mp3'
    ];

    let currentPlayingButton = null;

    audioFiles.forEach(audioPath => {
        const audioName = audioPath.split('/').pop().split('.')[0];

        const button = document.createElement('button');
        button.classList.add('audio-button');

        const buttonContentSpan = document.createElement('span');
        buttonContentSpan.classList.add('button-content');
        buttonContentSpan.textContent = audioName;
        button.appendChild(buttonContentSpan);

        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        button.appendChild(progressBar);

        button.dataset.audioSrc = audioPath;

        button.addEventListener('click', () => {
            // Se o botão clicado já for o que está tocando, pausa/continua
            if (currentPlayingButton === button && !currentAudio.paused) {
                currentAudio.pause();
                button.classList.remove('playing');
                progressBar.style.width = '0%';
                currentPlayingButton = null;
                currentAudio.classList.remove('active'); // Desativa o player ao pausar
                return;
            }

            if (currentPlayingButton) {
                currentAudio.pause();
                currentPlayingButton.classList.remove('playing');
                const prevProgressBar = currentPlayingButton.querySelector('.progress-bar');
                if (prevProgressBar) {
                    prevProgressBar.style.width = '0%';
                }
            }

            currentPlayingButton = button;
            button.classList.add('playing');
            currentAudio.src = button.dataset.audioSrc;

            currentAudio.play()
                .then(() => {
                    currentAudio.classList.add('active'); // Ativa o player ao começar a tocar
                })
                .catch(error => {
                    console.error('Erro ao reproduzir o áudio:', error);
                    alert('Não foi possível reproduzir o áudio. Verifique se o arquivo existe e se as permissões estão corretas.');
                    if (currentPlayingButton) {
                        currentPlayingButton.classList.remove('playing');
                        const currentProgressBar = currentPlayingButton.querySelector('.progress-bar');
                        if (currentProgressBar) {
                            currentProgressBar.style.width = '0%';
                        }
                        currentPlayingButton = null;
                    }
                    currentAudio.classList.remove('active'); // Garante que o player não fique ativo em caso de erro
                });
        });

        audioPlayerContainer.appendChild(button);
    });

    currentAudio.addEventListener('timeupdate', () => {
        if (currentPlayingButton && currentAudio.duration > 0) {
            const percentage = (currentAudio.currentTime / currentAudio.duration) * 100;
            const currentProgressBar = currentPlayingButton.querySelector('.progress-bar');
            if (currentProgressBar) {
                currentProgressBar.style.width = `${percentage}%`;
            }
        }
    });

    currentAudio.addEventListener('ended', () => {
        if (currentPlayingButton) {
            currentPlayingButton.classList.remove('playing');
            const currentProgressBar = currentPlayingButton.querySelector('.progress-bar');
            if (currentProgressBar) {
                currentProgressBar.style.width = '0%';
            }
            currentPlayingButton = null;
        }
        currentAudio.classList.remove('active'); // Desativa o player quando o áudio termina
    });

    currentAudio.addEventListener('pause', () => {
        if (currentPlayingButton && currentAudio.ended === false) {
            currentPlayingButton.classList.remove('playing');
        }
        currentAudio.classList.remove('active'); // Desativa o player ao pausar pelos controles
    });

    currentAudio.addEventListener('play', () => {
        const playingSrc = currentAudio.src;
        const matchingButton = Array.from(document.querySelectorAll('.audio-button')).find(btn => {
            return playingSrc.endsWith(btn.dataset.audioSrc);
        });

        if (matchingButton && !matchingButton.classList.contains('playing')) {
            document.querySelectorAll('.audio-button').forEach(btn => {
                btn.classList.remove('playing');
                const progressBarToReset = btn.querySelector('.progress-bar');
                if (progressBarToReset) {
                    progressBarToReset.style.width = '0%';
                }
            });
            matchingButton.classList.add('playing');
            currentPlayingButton = matchingButton;
        }
        currentAudio.classList.add('active'); // Ativa o player ao retomar a reprodução
    });
});