// const baseUrl = "http://localhost:3001/";
const baseUrl = "https://bis-server.vercel.app/";
let userName = localStorage.getItem("UserName");

let totalScore = 50;
let currentScore, scorePercentage, leaderboardData;
let selectedOption = null;

if (!sessionStorage.getItem("answeredQuestions")) {
  sessionStorage.setItem("answeredQuestions", JSON.stringify({}));
}

async function fetchLeaderboard() {
  try {
    const response = await axios.get(`${baseUrl}leaderboard`);
    const { success, data } = response.data;

    if (success) {
      return data;
    } else {
      alert("Error fetching leaderboard data");
      return [];
    }
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    alert(
      "An error occurred while fetching the leaderboard. Please try again."
    );
    return [];
  }
}

if (!sessionStorage.getItem("score")) {
  sessionStorage.setItem("score", 0);
} else {
  currentScore = parseInt(sessionStorage.getItem("score"), 10);
  scorePercentage = Math.min((currentScore / totalScore) * 100, 100); // Ensures it doesn't exceed 100%
  gsap.to("#Score", {
    width: `${scorePercentage}%`,
    duration: 1,
    ease: "power1.out",
  });
}

function selectOption(element) {
  const options = document.querySelectorAll(".option");
  options.forEach((option) => option.classList.remove("selected"));
  element.classList.add("selected");
  selectedOption = element.textContent;
}

function submitAnswer(answer, characterId) {
  const dialogueBox = document.getElementById("characterDialogueBox");
  let answeredQuestions =
    JSON.parse(sessionStorage.getItem("answeredQuestions")) || {};

  if (answeredQuestions[characterId]) {
    dialogueBox.textContent = "You have already answered this question.";
    dialogueBox.style.backgroundColor = "lightgray";
    dialogueBox.style.color = "black";
    gsap.to("#characterDialogueBox", {
      backgroundColor: "#f9f9f9",
      color: "black",
      delay: 2,
    });
    return;
  }

  if (selectedOption === answer) {
    dialogueBox.textContent = "You are correct";
    dialogueBox.style.backgroundColor = "green";
    dialogueBox.style.color = "white";
    currentScore = parseInt(sessionStorage.getItem("score"), 10);
    currentScore += 10;
  } else {
    dialogueBox.textContent = "You are wrong";
    dialogueBox.style.backgroundColor = "lightcoral";
    dialogueBox.style.color = "white";
  }

  sessionStorage.setItem("score", currentScore);
  scorePercentage = Math.min((currentScore / totalScore) * 100, 100); // Ensures it doesn't exceed 100%

  gsap.to("#Score", {
    width: `${scorePercentage}%`,
    duration: 1,
    ease: "power1.out",
  });

  answeredQuestions[characterId] = true;
  sessionStorage.setItem(
    "answeredQuestions",
    JSON.stringify(answeredQuestions)
  );

  gsap.to("#characterDialogueBox", {
    backgroundColor: "#f9f9f9",
    color: "black",
    delay: 2,
  });
}

function saveNexit() {
  axios
    .put(`${baseUrl}updateScore`, {
      username: userName,
      score: scorePercentage,
    })
    .then((response) => {
      const { message, success } = response.data;

      if (success) {
        alert(`Score updated successfully: ${message}`);
        window.location.href = "/";
      } else {
        alert(`Error updating score: ${message}`);
      }
    });
}

document.querySelector("#closeSaveNexit").addEventListener("click", () => {
  gsap.to(".saveNexit-container", {
    scale: 0,
    opacity: 0,
    pointerEvents: "none",
    duration: 0.2,
    onComplete: () => {
      gsap.to("#game", {
        filter: "blur(0px)",
        duration: 0.2,
      });
    },
  });
});

document.querySelector("#closeLeaderboard").addEventListener("click", () => {
  gsap.to(".leaderboard-container", {
    scale: 0,
    opacity: 0,
    pointerEvents: "none",
    duration: 0.2,
    onComplete: () => {
      gsap.to("#game", {
        filter: "blur(0px)",
        duration: 0.2,
      });
    },
  });
});

document.querySelector("#closeControls").addEventListener("click", () => {
  gsap.to(".controls-container", {
    scale: 0,
    opacity: 0,
    pointerEvents: "none",
    duration: 0.2,
    onComplete: () => {
      gsap.to("#game", {
        filter: "blur(0px)",
        duration: 0.2,
      });
    },
  });
});
document.querySelector("#saveNexit").addEventListener("click", () => {
  gsap.to(".saveNexit-container", {
    scale: 1,
    opacity: 1,
    pointerEvents: "auto",
    duration: 0.2,
    onComplete: () => {
      gsap.to("#game", {
        filter: "blur(5px)",
        duration: 0.2,
      });
    },
  });
});

document.querySelector("#leaderboard").addEventListener("click", () => {
  gsap.to(".leaderboard-container", {
    scale: 1,
    opacity: 1,
    pointerEvents: "auto",
    duration: 0.2,
    onComplete: () => {
      gsap.to("#game", {
        filter: "blur(5px)",
        duration: 0.2,
      });
      renderLeaderboard(leaderboardData);
    },
  });
});

document.querySelector("#controls").addEventListener("click", () => {
  gsap.to(".controls-container", {
    scale: 1,
    opacity: 1,
    pointerEvents: "auto",
    duration: 0.2,
    onComplete: () => {
      gsap.to("#game", {
        filter: "blur(5px)",
        duration: 0.2,
      });
    },
  });
});

async function renderLeaderboard() {
  const leaderboardContent = document.querySelector("#leaderboardContent");
  const data = await fetchLeaderboard(); // Await the leaderboard data

  leaderboardContent.innerHTML = `
  <table class="leaderboard-table">
    <thead>
      <tr>
        <th class="leaderboard-header">Name</th>
        <th class="leaderboard-header">Score</th>
      </tr>
    </thead>
    <tbody>
      ${data
        .map(
          (player) => `
            <tr class ="leaderboard-row">
              <td class="leaderboard-cell">${player.Username}</td>
              <td class="leaderboard-cell">${player.Score}</td>
            </tr>`
        )
        .join("")}
    </tbody>
  </table>
`;
}
