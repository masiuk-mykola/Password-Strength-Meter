const strengthMeter = document.getElementById('strength-meter');
const passwordInput = document.getElementById('password-input');
const reasonsContainer = document.getElementById('reasons');

passwordInput.addEventListener('input', updateStrengthMeter);
updateStrengthMeter();

function updateStrengthMeter() {
  const weaknesses = calculateStrength(passwordInput.value);
  let strength = 100;

  reasonsContainer.innerHTML = '';
  weaknesses.forEach((weakness) => {
    if (weakness === undefined) return;
    strength -= weakness.deduction;

    const messageElement = document.createElement('div');
    messageElement.innerText = weakness.message;
    reasonsContainer.appendChild(messageElement);
  });

  strengthMeter.style.setProperty('--strength', strength);
}

function calculateStrength(password) {
  const weaknesses = [];
  weaknesses.push(lengthWeakness(password));
  weaknesses.push(lowerCaseWeakness(password));
  weaknesses.push(upperCaseWeakness(password));
  weaknesses.push(numberWeakness(password));
  weaknesses.push(specialCharactersWeakness(password));
  weaknesses.push(repeatCharacterWeakness(password));
  return weaknesses;
}

function lengthWeakness(password) {
  const length = password.length;
  if (password.length <= 5) {
    return {
      message: 'Your password is too short',
      deduction: 40
    };
  }

  if (password.length <= 10) {
    return {
      message: 'Your password could be longer',
      deduction: 15
    };
  }
}

function lowerCaseWeakness(password) {
  return characterTypeWeakness(password, /[a-z]/g, 'lowercase characters');
}

function upperCaseWeakness(password) {
  return characterTypeWeakness(password, /[A-Z]/g, 'uppercase characters');
}

function numberWeakness(password) {
  return characterTypeWeakness(password, /[0-9]/g, 'numbers');
}

function specialCharactersWeakness(password) {
  return characterTypeWeakness(
    password,
    /[^0-9a-zA-Z\s]/g,

    'special characters'
  );
}

function characterTypeWeakness(password, regex, type) {
  const matches = password.match(regex) || [];

  if (matches.length === 0) {
    return {
      message: `Your password has not ${type}`,
      deduction: 20
    };
  }

  if (matches.length <= 2) {
    return {
      message: `Your password could use more ${type}`,
      deduction: 5
    };
  }
}

function repeatCharacterWeakness(password) {
  const matches = password.match(/(.)\1/g) || [];
  if (matches.length > 0) {
    return {
      message: 'Your password has repeat characters',
      deduction: matches.length * 10
    };
  }
}
