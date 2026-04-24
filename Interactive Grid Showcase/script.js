        // 1. Change Background - Simple background color change
        function changeBackground() {
            const colors = [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
            ];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            document.body.style.background = randomColor;
        }

        // 2. Confetti Blast - Create colorful confetti falling
        function confetti() {
    const count = 500; // more pieces for density
    for (let i = 0; i < count; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.style.position = 'fixed';
        confettiPiece.style.width = '8px';
        confettiPiece.style.height = '8px';
        confettiPiece.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confettiPiece.style.left = Math.random() * window.innerWidth + 'px';
        confettiPiece.style.top = '-10px';
        confettiPiece.style.zIndex = '999';
        confettiPiece.style.borderRadius = '50%';
        document.body.appendChild(confettiPiece);

        let position = -10;
        let leftPosition = parseFloat(confettiPiece.style.left);
        const fallSpeed = 4 + Math.random() * 4; // faster
        const sideMovement = (Math.random() - 0.5) * 4; // more swaying

        const falling = setInterval(() => {
            position += fallSpeed;
            leftPosition += sideMovement;
            confettiPiece.style.top = position + 'px';
            confettiPiece.style.left = leftPosition + 'px';

            if (position > window.innerHeight) {
                clearInterval(falling);
                confettiPiece.remove();
            }
        }, 15); // faster updates
    }
}


        // 3. Flash Screen - White flash effect
        function flashScreen() {
            const flash = document.createElement('div');
            flash.className = 'overlay';
            flash.style.backgroundColor = 'white';
            flash.style.opacity = '0';
            document.body.appendChild(flash);
            
            // Fade in quickly
            setTimeout(() => {
                flash.style.transition = 'opacity 0.1s';
                flash.style.opacity = '1';
            }, 10);
            
            // Fade out
            setTimeout(() => {
                flash.style.transition = 'opacity 0.3s';
                flash.style.opacity = '0';
            }, 150);
            
            setTimeout(() => flash.remove(), 500);
        }

        // 4. Falling Emojis - Random emojis falling from top
        function fallingEmojis() {
    const emojis = ['😀', '😎', '🚀', '⭐', '🔥', '💯', '🎉', '✨', '💫', '🌟'];
    const count = 80; // more emojis for density

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.position = 'fixed';
            emoji.style.fontSize = 20 + Math.random() * 20 + 'px'; // random size
            emoji.style.left = Math.random() * window.innerWidth + 'px';
            emoji.style.top = '-50px';
            emoji.style.zIndex = '999';
            emoji.style.pointerEvents = 'none'; // avoids blocking clicks

            document.body.appendChild(emoji);

            let position = -50;
            let leftPosition = parseFloat(emoji.style.left);
            const fallSpeed = 4 + Math.random() * 4; // faster fall
            const sideMovement = (Math.random() - 0.5) * 3; // slight sway

            const falling = setInterval(() => {
                position += fallSpeed;
                leftPosition += sideMovement;
                emoji.style.top = position + 'px';
                emoji.style.left = leftPosition + 'px';

                if (position > window.innerHeight) {
                    clearInterval(falling);
                    emoji.remove();
                }
            }, 15); // smoother animation
        }, i * 50); // faster spawn
    }
}


        // 5. Color Wave - Boxes change color in sequence
        function colorWave() {
            const boxes = document.querySelectorAll('.box');
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#00b894'];
            
            boxes.forEach((box, index) => {
                setTimeout(() => {
                    const originalBg = box.style.background;
                    box.style.background = colors[index % colors.length];
                    box.style.transform = 'scale(1.1)';
                    
                    setTimeout(() => {
                        box.style.background = originalBg;
                        box.style.transform = 'scale(1)';
                    }, 500);
                }, index * 100);
            });
        }

        // 6. Floating Bubbles - Bubbles float up from bottom
        function bubbles() {
    const count = 200; // more bubbles for density

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const bubble = document.createElement('div');
            const size = 10 + Math.random() * 30; // smaller and varied
            bubble.style.position = 'fixed';
            bubble.style.width = size + 'px';
            bubble.style.height = size + 'px';
            bubble.style.borderRadius = '50%';
            bubble.style.backgroundColor = `rgba(255, 255, 255, ${0.2 + Math.random() * 0.5})`;
            bubble.style.border = '1px solid rgba(255, 255, 255, 0.5)';
            bubble.style.left = Math.random() * window.innerWidth + 'px';
            bubble.style.bottom = '-50px';
            bubble.style.zIndex = '999';
            bubble.style.pointerEvents = 'none'; // avoid blocking clicks

            document.body.appendChild(bubble);

            let position = -50;
            let sideMovement = (Math.random() - 0.5) * 2; // slight horizontal sway
            let leftPosition = parseFloat(bubble.style.left);
            const riseSpeed = 3 + Math.random() * 3; // faster rise

            const rising = setInterval(() => {
                position += riseSpeed;
                leftPosition += sideMovement;
                bubble.style.bottom = position + 'px';
                bubble.style.left = leftPosition + 'px';

                if (position > window.innerHeight + 50) {
                    clearInterval(rising);
                    bubble.remove();
                }
            }, 15); // smoother movement
        }, i * 20); // faster spawn
    }
}


        // 7. Night Mode - Dark overlay appears
        function nightMode() {
            const night = document.createElement('div');
            night.className = 'overlay';
            night.style.backgroundColor = 'rgba(0, 0, 20, 0.8)';
            night.style.opacity = '0';
            document.body.appendChild(night);
            
            setTimeout(() => {
                night.style.transition = 'opacity 0.5s';
                night.style.opacity = '1';
            }, 10);
            
            // Add some stars
            for (let i = 0; i < 30; i++) {
                const star = document.createElement('div');
                star.style.position = 'fixed';
                star.style.width = '3px';
                star.style.height = '3px';
                star.style.backgroundColor = 'white';
                star.style.borderRadius = '50%';
                star.style.left = Math.random() * window.innerWidth + 'px';
                star.style.top = Math.random() * window.innerHeight + 'px';
                star.style.zIndex = '1001';
                star.style.boxShadow = '0 0 3px white';
                night.appendChild(star);
            }
            
            setTimeout(() => {
                night.style.opacity = '0';
                setTimeout(() => night.remove(), 500);
            }, 3000);
        }

        // 8. Heart Rain - Hearts falling from top
        function heartRain() {
    const count = 100; // more hearts for density

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = '❤️';
            heart.style.position = 'fixed';
            heart.style.fontSize = (15 + Math.random() * 25) + 'px'; // varied size
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = '-50px';
            heart.style.zIndex = '999';
            heart.style.pointerEvents = 'none'; // avoid blocking clicks
            heart.style.transform = `rotate(${Math.random() * 360}deg)`; // random rotation

            document.body.appendChild(heart);

            let position = -50;
            let leftPosition = parseFloat(heart.style.left);
            const fallSpeed = 3 + Math.random() * 3; // faster fall
            const sideMovement = (Math.random() - 0.5) * 2; // slight sway
            const falling = setInterval(() => {
                position += fallSpeed;
                leftPosition += sideMovement;
                heart.style.top = position + 'px';
                heart.style.left = leftPosition + 'px';
                heart.style.opacity = 1 - position / window.innerHeight;

                if (position > window.innerHeight) {
                    clearInterval(falling);
                    heart.remove();
                }
            }, 15); // smoother animation
        }, i * 30); // faster spawn for density
    }
}


        // 9. Random Colors - Each box gets random color
        function randomColors() {
            const boxes = document.querySelectorAll('.box');
            boxes.forEach(box => {
                const randomColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
                box.style.background = randomColor;
                box.style.transform = 'rotate(5deg)';
                
                setTimeout(() => {
                    box.style.background = 'linear-gradient(135deg, #2d3748, #1a202c)';
                    box.style.transform = 'rotate(0deg)';
                }, 1000);
            });
        }

        // 10. Shooting Stars - Stars shoot across screen
       function shootingStars() {
    const meteorCount = 40; // denser meteors

    for (let i = 0; i < meteorCount; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            const size = 8 + Math.random() * 25; // varied meteor size
            star.style.position = 'fixed';
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.backgroundColor = 'orange';
            star.style.borderRadius = '50%';
            star.style.boxShadow = `0 0 15px orange, 0 0 25px yellow`;
            star.style.right = '-50px';
            star.style.top = Math.random() * window.innerHeight * 0.7 + 'px';
            star.style.zIndex = '999';
            star.style.transform = `rotate(${Math.random() * 360}deg)`;
            star.style.pointerEvents = 'none';

            document.body.appendChild(star);

            let positionRight = -50;
            let topPosition = parseFloat(star.style.top);
            const speed = 12 + Math.random() * 10; // faster for dynamic look
            const angle = 0.5 + Math.random() * 2; // slight downward angle

            const shooting = setInterval(() => {
                positionRight += speed;
                topPosition += angle;
                star.style.right = positionRight + 'px';
                star.style.top = topPosition + 'px';

                if (positionRight > window.innerWidth + 50 || topPosition > window.innerHeight + 50) {
                    clearInterval(shooting);
                    star.remove();
                }
            }, 16); // ~60fps
        }, i * 100); // faster spawn → denser
    }
}



        // 11. Snowfall - Snowflakes falling
        function snowfall() {
    const count = 400; // more snowflakes for density

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const snowflake = document.createElement('div');
            snowflake.textContent = '❄️';
            snowflake.style.position = 'fixed';
            snowflake.style.fontSize = (15 + Math.random() * 20) + 'px'; // varied size
            snowflake.style.left = Math.random() * window.innerWidth + 'px';
            snowflake.style.top = '-30px';
            snowflake.style.zIndex = '999';
            snowflake.style.opacity = 0.6 + Math.random() * 0.4;
            snowflake.style.pointerEvents = 'none';

            document.body.appendChild(snowflake);

            let position = -30;
            let sidePosition = parseFloat(snowflake.style.left);
            let direction = Math.random() > 0.5 ? 1 : -1;
            const fallSpeed = 2 + Math.random() * 2; // faster fall
            const sway = 0.5 + Math.random() * 1.5; // horizontal sway

            const falling = setInterval(() => {
                position += fallSpeed;
                sidePosition += direction * sway;
                snowflake.style.top = position + 'px';
                snowflake.style.left = sidePosition + 'px';

                // Slight sway direction change
                if (Math.random() > 0.95) direction *= -1;

                if (position > window.innerHeight) {
                    clearInterval(falling);
                    snowflake.remove();
                }
            }, 16); // ~60fps smooth
        }, i * 20); // faster spawn for dense effect
    }
}

        // 12. Disco Mode - Random flashing colors
        function disco() {
    let count = 0;
    const disco = setInterval(() => {
        // Flash body background
        document.body.style.background = `hsl(${Math.random() * 360}, 80%, 50%)`;
        document.body.style.transition = 'background 0.1s';

        // Flash all containers
        const containers = document.querySelectorAll('.box');
        containers.forEach(container => {
            container.style.background = `hsl(${Math.random() * 360}, 80%, 50%)`;
            container.style.transition = 'background 0.1s';
        });

        count++;
        if (count > 60) { // longer disco
            clearInterval(disco);
            // Reset body
            document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            // Reset containers
            containers.forEach(container => {
                container.style.background = ''; // or original color
            });
        }
    }, 100); // fast flashes
}

        // 13. Simple Fireworks - Circles expanding
        function fireworks() {
    const fireworksCount = 15; // more fireworks for density

    for (let i = 0; i < fireworksCount; i++) {
        setTimeout(() => {
            const centerX = 50 + Math.random() * (window.innerWidth - 100);
            const centerY = 50 + Math.random() * (window.innerHeight - 100);
            const particlesCount = 50 + Math.floor(Math.random() * 50); // more particles per firework

            for (let j = 0; j < particlesCount; j++) {
                const particle = document.createElement('div');
                const size = 3 + Math.random() * 3;
                particle.style.position = 'fixed';
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
                particle.style.borderRadius = '50%';
                particle.style.left = centerX + 'px';
                particle.style.top = centerY + 'px';
                particle.style.zIndex = '999';
                particle.style.pointerEvents = 'none';
                document.body.appendChild(particle);

                const angle = Math.random() * 2 * Math.PI; // random direction
                const speed = 4 + Math.random() * 6; // faster particles
                let x = centerX;
                let y = centerY;
                let opacity = 1;

                const move = setInterval(() => {
                    x += Math.cos(angle) * speed;
                    y += Math.sin(angle) * speed;
                    opacity -= 0.025; // fade faster
                    particle.style.left = x + 'px';
                    particle.style.top = y + 'px';
                    particle.style.opacity = opacity;

                    if (opacity <= 0) {
                        clearInterval(move);
                        particle.remove();
                    }
                }, 16); // smooth ~60fps
            }
        }, i * 150); // closer fireworks for density
    }
}

        // 14. Fade Effect - Boxes fade in and out
        function fadeBoxes() {
            const boxes = document.querySelectorAll('.box');
            boxes.forEach((box, index) => {
                setTimeout(() => {
                    box.style.opacity = '0';
                    
                    setTimeout(() => {
                        box.style.transition = 'opacity 0.5s';
                        box.style.opacity = '1';
                    }, 500);
                }, index * 100);
            });
        }

        // 15. Reset All - Clear everything
        function resetAll() {
            // Remove all created elements
            const elements = document.querySelectorAll('.overlay, div[style*="position: fixed"]');
            elements.forEach(el => {
                if (!el.classList.contains('box') && !el.classList.contains('btn')) {
                    el.remove();
                }
            });
            
            // Reset body background
            document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            
            // Reset all boxes
            const boxes = document.querySelectorAll('.box');
            boxes.forEach(box => {
                box.style.background = 'linear-gradient(135deg, #2d3748, #1a202c)';
                box.style.transform = 'scale(1) rotate(0deg)';
                box.style.opacity = '1';
                box.style.transition = 'all 0.3s ease';
            });
        }