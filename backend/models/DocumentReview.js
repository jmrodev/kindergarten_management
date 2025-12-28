// models/DocumentReview.js

class DocumentReview {
  constructor(data) {
    this.id = data.id;
    this.document_type = data.document_type;
    this.document_id = data.document_id;
    this.reviewer_id = data.reviewer_id;
    this.review_date = data.review_date;
    this.status = data.status;
    this.notes = data.notes;
    this.verified_delivery = data.verified_delivery;
    this.delivery_verified_by = data.delivery_verified_by;
    this.delivery_verified_at = data.delivery_verified_at;

    // Joined fields
    this.student_name = data.student_name;
    this.guardian_name = data.guardian_name;
    this.reviewer_name = data.reviewer_name;
    this.delivery_verifier_name = data.delivery_verifier_name;
  }

  static fromDbRow(row) {
    if (!row) return null;
    return new DocumentReview(row);
  }
}

module.exports = DocumentReview;