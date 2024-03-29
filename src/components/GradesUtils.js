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
  if (current_grades_list != null) {
    gradeItems = current_grades_list;
  }
  return gradeItems;
}

function getCurrentGradeId() {
  current_grade_id = JSON.parse(localStorage.getItem("gradeID"));
  if (current_grade_id == null) {
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

export function deleteGrade(id) {
  getCurrentGradeList();
  let index = 0;
  for (var i = 0; i < gradeItems.length; i++) {
    index++;
    if (gradeItems[i].id === id) {
      break;
    }
  }
  gradeItems.splice(index - 1, 1);
  setCurrentGradeItems();
  reloadGradeList();
}

export function validName(name) {
  return name != "";
}

export function validGrade(grade) {
  return grade >= 0 && grade <= 100;
}

export function validCredits(credits) {
  return credits >= 0;
}

export function getMinGrade() {
  getCurrentGradeList();
  if (gradeItems.length === 0) {
    return 0;
  }
  let minGrade = 100;
  for (var i = 0; i < gradeItems.length; i++) {
    if (gradeItems[i].grade < minGrade) {
      minGrade = gradeItems[i].grade;
    }
  }
  return minGrade.toFixed(2);
}

export function getMaxGrade() {
  getCurrentGradeList();
  if (gradeItems.length === 0) {
    return 0;
  }
  let maxGrade = 0;
  for (var i = 0; i < gradeItems.length; i++) {
    if (gradeItems[i].grade > maxGrade) {
      maxGrade = gradeItems[i].grade;
    }
  }
  return maxGrade.toFixed(2);
}

export function getSumCredits() {
  getCurrentGradeList();
  if (gradeItems.length === 0) {
    return 0;
  }
  let sumCredits = 0;
  for (var i = 0; i < gradeItems.length; i++) {
    sumCredits += gradeItems[i].credits;
  }
  return sumCredits.toFixed(2);
}

export function getAverage() {
  getCurrentGradeList();
  if (gradeItems.length === 0) {
    return 0;
  }
  let sum = 0;
  let creditCouter = 0;
  for (var i = 0; i < gradeItems.length; i++) {
    sum += gradeItems[i].grade * gradeItems[i].credits;
    creditCouter += gradeItems[i].credits;
  }
  return (sum / creditCouter).toFixed(2);
}

export function getStatistics() {
  let statisticsItem = new StatisticsItem(
    0,
    getAverage(),
    getSumCredits(),
    getMaxGrade(),
    getMinGrade()
  );
  return [statisticsItem];
}

class StatisticsItem {
  constructor(id, average, sumCredits, maxGrade, minGrade) {
    this.id = id;
    this.average = average;
    this.sumCredits = sumCredits;
    this.maxGrade = maxGrade;
    this.minGrade = minGrade;
  }
}

class GradeItem {
  constructor(id, name, grade, credits) {
    this.id = id;
    this.name = name;
    this.grade = grade;
    this.credits = credits;
  }
}

export function saveToCsvFile() {
  getCurrentGradeList();
  let rows = [["Course Name", "Grade", "Credits"]];
  for (const gradeItem of gradeItems) {
    rows.push([gradeItem.name, gradeItem.grade, gradeItem.credits]);
  }
  rows.push([]); // add empty line
  rows.push([
    "Grades Average",
    "Number of Credits",
    "Highest Grade	",
    "Lowest Grade",
  ]);
  rows.push([getAverage(), getSumCredits(), getMaxGrade(), getMinGrade()]);

  let csvContent = "data:text/csv;charset=utf-8,";

  rows.forEach(function(rowArray) {
    let row = rowArray.join(",");
    csvContent += row + "\n";
  });

  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
}

const csvFileToObjectArray = (string) => {
  const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
  const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
  const array = csvRows.map((i) => {
    const values = i.split(",");
    const obj = csvHeader.reduce((object, header, index) => {
      object[header] = values[index];
      return object;
    }, {});
    return obj;
  });

  let result = [];
  for(var row_grade of array) {
    if(row_grade['Course Name'] === '') {
      break;
    } else {
      result.push(row_grade);
    }
  }
  return result;
};

export function setGradesFromFile(data) {
  const objects_array = csvFileToObjectArray(data);
  for(var grade of objects_array) {
    addGrade(grade['Course Name'], parseFloat(grade['Grade']), parseFloat(grade['Credits']));
  }
  console.table(objects_array);
  // console.log(objects_array);
}
