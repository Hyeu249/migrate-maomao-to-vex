class EquipmentGroupTemplate {
  constructor(data = {}) {
    if (data.create_time) this.create_time = makeString(data.create_time);
    if (data.update_time) this.update_time = makeString(data.update_time);
    if (data.created_by) this.created_by = makeString(data.created_by);
    if (data.last_updated_by) this.last_updated_by = makeString(data.last_updated_by);
    if (data.deleted_by) this.deleted_by = makeString(data.deleted_by);
    if (data.deleted_at) this.deleted_at = makeString(data.deleted_at);

    if (data.id) this.id = makeString(data.id);
    if (data.name) this.name = makeString(data.name);
    if (data.equipment_type) this.equipment_type = makeString(data.equipment_type);
    if (data.description) this.description = makeString(data.description);
  }
  getFields() {
    return Object.keys(this).join(", ");
  }
  getValues() {
    return Object.values(this).join(", ");
  }
}
module.exports = EquipmentGroupTemplate;

function makeString(value) {
  return `'${String(value.trim() || "")}'`;
}
