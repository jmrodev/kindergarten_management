export const formatStudentDataForBackend = (data) => {
    // Separate student fields from top-level
    // Map flat snake_case state to nested camelCase expected by Backend Controllers
    const student = {
        firstName: data.first_name,
        middleName: data.middle_name_optional,
        thirdName: data.third_name_optional,
        paternalSurname: data.paternal_surname,
        maternalSurname: data.maternal_surname,
        nickname: data.nickname_optional,
        dni: data.dni,
        birthDate: data.birth_date,
        gender: data.gender,
        healthInsurance: data.health_insurance,
        affiliateNumber: data.affiliate_number,
        allergies: data.allergies,
        medications: data.medications,
        medicalObservations: data.medical_observations,
        bloodType: data.blood_type,
        pediatricianName: data.pediatrician_name,
        pediatricianPhone: data.pediatrician_phone,
        photoAuthorization: data.photo_authorization,
        tripAuthorization: data.trip_authorization,
        medicalAttentionAuthorization: data.medical_attention_authorization,
        hasSiblingsInSchool: data.has_siblings_in_school,
        specialNeeds: data.special_needs,
        vaccinationStatus: data.vaccination_status,
        observations: data.observations,
        status: data.status,

        // Address nested
        address: {
            street: data.street,
            number: data.number,
            city: data.city,
            provincia: data.provincia,
            postalCode: data.postal_code_optional
        }
    };

    return {
        student: student,
        guardians: data.guardians || [],
        classroomId: data.classroom_id,
        shift: data.shift
    };
};
