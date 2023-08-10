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
    if (data.description) this.description = makeString(data.description);
    if (data.manufacturer) this.manufacturer = makeString(data.manufacturer);
    this.is_reusable = Boolean(data.is_reusable || false);
    this.maintenance_cycle_km = Number(data.maintenance_cycle_km || 0);
    this.maintenance_cycle_hour = Number(data.maintenance_cycle_hour || 0);
    if (data.equipment_group_id) this.equipment_group_id = makeString(data.equipment_group_id);
    if (data.maintenance_type_id) this.maintenance_type_id = makeString(data.maintenance_type_id);

    if (data.used_km) this.used_km = Number(data.used_km || 0);
    if (data.used_hours) this.used_hours = Number(data.used_hours || 0);
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
