let gradeItems = [];
let current_grade_id = 0;

export function addGrade(name, grade, credits) {
  getCurrentGradeId();
  getCurrentGradeList();
  let gradeItem = new GradeItem(current_grade_id, name, grade, credits);
  gradeItems.push(gradeItem);
  setCurrentGradeItems();
  setCurrentGradeId();
  reloadGradeList();
}

function reloadGradeList() {
  window.location.reload(false);
}

export function getCurrentGradeList() {
  let current_grades_list = JSON.parse(localStorage.getItem("gradeItems"));
  if(current_grades_list != null) {
    gradeItems = current_grades_list;
  }
  console.log("current id: ", current_grade_id);
  console.table(gradeItems);
  return gradeItems;
}

function getCurrentGradeId() {
  current_grade_id = JSON.parse(localStorage.getItem("gradeID"));
  if(current_grade_id == null) {
    current_grade_id = 0;
  }
}

function setCurrentGradeId() {
  localStorage.setItem("gradeID", JSON.stringify(current_grade_id));
}

function setCurrentGradeItems() {
  current_grade_id++;
  localStorage.setItem("gradeItems", JSON.stringify(gradeItems));
}

export function clearGradesItems() {
  gradeItems = [];
  localStorage.removeItem("gradeItems");
  current_grade_id = 0;
  setCurrentGradeId();
  reloadGradeList();
}

class GradeItem {
  constructor(id, name, grade, credits) {
    this.id = id;
    this.name = name;
    this.grade = grade;
    this.credits = credits;
  }
}
