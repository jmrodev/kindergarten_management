class DocumentReview {
    constructor(
        id, documentType, documentId, reviewerId, reviewDate, status, notes,
        verifiedDelivery, deliveryVerifiedBy, deliveryVerifiedAt,
        reviewerName = null, deliveryVerifierName = null
    ) {
        this.id = id;
        this.documentType = documentType;
        this.documentId = documentId;
        this.reviewerId = reviewerId;
        this.reviewDate = reviewDate;
        this.status = status;
        this.notes = notes;
        this.verifiedDelivery = verifiedDelivery;
        this.deliveryVerifiedBy = deliveryVerifiedBy;
        this.deliveryVerifiedAt = deliveryVerifiedAt;

        this.reviewerName = reviewerName;
        this.deliveryVerifierName = deliveryVerifierName;
    }

    static fromDbRow(row) {
        if (!row) return null;
        return new DocumentReview(
            row.id,
            row.document_type,
            row.document_id,
            row.reviewer_id,
            row.review_date,
            row.status,
            row.notes,
            row.verified_delivery,
            row.delivery_verified_by,
            row.delivery_verified_at,
            row.reviewer_name,
            row.delivery_verifier_name
        );
    }

    toDbRow() {
        return {
            document_type: this.documentType,
            document_id: this.documentId,
            reviewer_id: this.reviewerId,
            review_date: this.reviewDate,
            status: this.status,
            notes: this.notes,
            verified_delivery: this.verifiedDelivery,
            delivery_verified_by: this.deliveryVerifiedBy,
            delivery_verified_at: this.deliveryVerifiedAt
        };
    }
}

module.exports = DocumentReview;
