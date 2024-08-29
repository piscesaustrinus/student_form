
const connToken = "90932073|-31949218712874147|90961932"; // Replace with your connection token
const dbName = "SCHOOL-DB";
const relName = "STUDENT-TABLE";

$(document).ready(function () {
    resetForm();
    $("#rollNo").focus();
});

function resetForm() {
    $("#rollNo").val("").prop("disabled", false);
    $("#fullName").val("").prop("disabled", true);
    $("#class").val("").prop("disabled", true);
    $("#birthDate").val("").prop("disabled", true);
    $("#address").val("").prop("disabled", true);
    $("#enrollmentDate").val("").prop("disabled", true);
    $("#saveBtn").prop("disabled", true);
    $("#updateBtn").prop("disabled", true);
    $("#resetBtn").prop("disabled", true);
    $("#rollNo").focus();
}

function getStudent() {
    const rollNo = $("#rollNo").val().trim();
    if (rollNo === "") {
        alert("Roll No is required");
        resetForm();
        return;
    }

    const getRequest = createGET_BY_KEYRequest(connToken, dbName, relName, JSON.stringify({ rollNo: rollNo }));
    jQuery.ajaxSetup({ async: false });
    const resultObj = executeCommandAtGivenBaseUrl(getRequest, "http://api.login2explore.com:5577", "/api/irl");
    jQuery.ajaxSetup({ async: true });

    if (resultObj.status === 400) { // Roll No not found
        $("#saveBtn").prop("disabled", false);
        $("#resetBtn").prop("disabled", false);
        enableFormFields();
    } else if (resultObj.status === 200) { // Roll No found
        const data = JSON.parse(resultObj.data).record;
        $("#fullName").val(data.fullName);
        $("#class").val(data.class);
        $("#birthDate").val(data.birthDate);
        $("#address").val(data.address);
        $("#enrollmentDate").val(data.enrollmentDate);

        $("#rollNo").prop("disabled", true);
        $("#updateBtn").prop("disabled", false);
        $("#resetBtn").prop("disabled", false);
        enableFormFields();
        $("#fullName").focus();

        // Save record number for updating
        localStorage.setItem('recno', JSON.parse(resultObj.data).rec_no);
    }
}

function enableFormFields() {
    $("#fullName").prop("disabled", false);
    $("#class").prop("disabled", false);
    $("#birthDate").prop("disabled", false);
    $("#address").prop("disabled", false);
    $("#enrollmentDate").prop("disabled", false);
}

function validateAndGetFormData() {
    const rollNo = $("#rollNo").val().trim();
    const fullName = $("#fullName").val().trim();
    const studentClass = $("#class").val().trim();
    const birthDate = $("#birthDate").val().trim();
    const address = $("#address").val().trim();
    const enrollmentDate = $("#enrollmentDate").val().trim();

    if (fullName === "" || studentClass === "" || birthDate === "" || address === "" || enrollmentDate === "") {
        alert("All fields are required");
        return "";
    }

    return JSON.stringify({
        rollNo: rollNo,
        fullName: fullName,
        class: studentClass,
        birthDate: birthDate,
        address: address,
        enrollmentDate: enrollmentDate,
    });
}

function saveStudent() {
    const jsonStr = validateAndGetFormData();
    if (jsonStr === "") return;

    const putRequest = createPUTRequest(connToken, jsonStr, dbName, relName);
    jQuery.ajaxSetup({ async: false });
    const resultObj = executeCommandAtGivenBaseUrl(putRequest, "http://api.login2explore.com:5577", "/api/iml");
    jQuery.ajaxSetup({ async: true });

    alert("Student saved successfully!");
    resetForm();
}

function updateStudent() {
    const jsonStr = validateAndGetFormData();
    if (jsonStr === "") return;

    const recNo = localStorage.getItem('recno'); // Retrieve record number
    const updateRequest = createUPDATERecordRequest(connToken, jsonStr, dbName, relName, recNo);
    jQuery.ajaxSetup({ async: false });
    const resultObj = executeCommandAtGivenBaseUrl(updateRequest, "http://api.login2explore.com:5577", "/api/iml");
    jQuery.ajaxSetup({ async: true });

    alert("Student details updated successfully!");
    resetForm();
}

