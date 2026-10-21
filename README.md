STUDYHUB - Study Schedule
br [Leia em português](README.pt-BR.md)
Acesso:[janetebs.github.io/studyhub-cronograma](https://brazaojane.github.io/studyhub-cronograma/)

A web application that automatically generates a weekly study schedule 
based on the subjects, weekly study hours, and priorities defined by the user.

## FEATURES
- Add subjects with their name, weekly study hours, and priority (High, Medium, or Low).
- Automatically distribute study sessions across the seven days of the week based on each subject's priority.
- Weekly schedule displayed in a visual grid with unique colors for each subject.
- Sort the schedule by creation order, priority, study hours, or subject name.
- Weekly summary showing total study hours, number of subjects, study sessions, and active days.
- Progress bar displaying the proportional workload of each subject.
- Export the schedule to PDF using the browser's print feature.
- Local data persistence using LocalStorage, with no login or server required.

## TECHNOLOGIES
- HTML5
- CSS3
- JavaScript (Vanilla)
No frameworks or external dependencies. A 100% front-end project hosted on GitHub Pages.

## HOW TO USE
1. Open the application using the link above.
2. In the side panel, enter the subject name, weekly study hours, and priority.
3. Click **"+ Add Subject"**.
4. The weekly schedule will be generated automatically, distributing the study sessions across the week.
5. Use the sorting buttons to reorganize the schedule.
6. Click **"Print"** to export the schedule as a PDF.

## DISTRIBUTION LOGIC
- High-priority subjects are distributed across up to 5 day of the week.
- Medium-priority subjects are distributed across up to 3 days.
- Low-priority subjects are distributed across up to 2 days.
- Weekly study hours are divided into study sessions of approximately 1 hour and 30 minutes.

## PROJECT STRUCTURE
index.html
style.css
script.js

## AUTHOR ──── ୨୧ ────
Developed by Janete Brazão as a portfolio project.
