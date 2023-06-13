class DriverTemplate {
  constructor(data = {}) {
    if (data.create_time) this.create_time = makeString(data.create_time);
    if (data.update_time) this.update_time = makeString(data.update_time);
    if (data.created_by) this.created_by = makeString(data.created_by);
    if (data.last_updated_by) this.last_updated_by = makeString(data.last_updated_by);
    if (data.deleted_by) this.deleted_by = makeString(data.deleted_by);
    if (data.deleted_at) this.deleted_at = makeString(data.deleted_at);

    if (data.id) this.id = makeString(data.id);
    if (data.first_name) this.first_name = makeString(data.first_name);
    if (data.last_name) this.last_name = makeString(data.last_name);
    if (data.date_of_birth) this.date_of_birth = makeString(data.date_of_birth);
    if (data.national_id_card_no) this.national_id_card_no = makeString(data.national_id_card_no);
    if (data.tax_id) this.tax_id = makeString(data.tax_id);
    if (data.address) this.address = makeString(data.address);
    if (data.phone) this.phone = makeString(data.phone);
    if (data.email) this.email = makeString(data.email);
    if (data.join_date) this.join_date = makeString(data.join_date);
    if (data.exit_date) this.exit_date = makeString(data.exit_date);
    if (data.advance_payment_limit) this.advance_payment_limit = Number(data.advance_payment_limit || 0);
    if (data.advance_payment_amount) this.advance_payment_amount = Number(data.advance_payment_amount || 0);
    if (data.deposit_amount) this.deposit_amount = Number(data.deposit_amount || 0);
    if (data.job_status) this.job_status = makeString(data.job_status);
    if (data.driver_deposit_type_id) this.driver_deposit_type_id = makeString(data.driver_deposit_type_id);
  }
  getFields() {
    return Object.keys(this).join(", ");
  }
  getValues() {
    return Object.values(this).join(", ");
  }
}
module.exports = DriverTemplate;

function makeString(value) {
  return `'${String(value || "")}'`;
}
