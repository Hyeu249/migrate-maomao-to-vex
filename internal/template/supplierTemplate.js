class SupplierTemplate {
  constructor(data = {}) {
    if (data.create_time) this.create_time = makeString(data.create_time);
    if (data.update_time) this.update_time = makeString(data.update_time);
    if (data.created_by) this.created_by = makeString(data.created_by);
    if (data.last_updated_by) this.last_updated_by = makeString(data.last_updated_by);
    if (data.deleted_by) this.deleted_by = makeString(data.deleted_by);
    if (data.deleted_at) this.deleted_at = makeString(data.deleted_at);

    if (data.id) this.id = makeString(data.id);
    if (data.name) this.name = makeString(data.name);
    if (data.short_name) this.short_name = makeString(data.short_name);
    if (data.agent_name) this.agent_name = makeString(data.agent_name);
    if (data.address) this.address = makeString(data.address);
    if (data.additional_option) this.additional_option = makeString(data.additional_option);
    if (data.phone) this.phone = makeString(data.phone);
    if (data.email) this.email = makeString(data.email);
    if (data.supply_type_id) this.supply_type_id = makeString(data.supply_type_id);
  }
  getFields() {
    return Object.keys(this).join(", ");
  }
  getValues() {
    return Object.values(this).join(", ");
  }
}
module.exports = SupplierTemplate;

function makeString(value) {
  return `'${String(value.trim() || "")}'`;
}
