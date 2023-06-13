class TyreTemplate {
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
    if (data.specification) this.specification = makeString(data.specification);
    if (data.serial_no) this.serial_no = makeString(data.serial_no);
    if (data.operation_limit_km) this.operation_limit_km = Number(data.operation_limit_km || 0);
    if (data.replace_noti_max_threshold_km) this.replace_noti_max_threshold_km = Number(data.replace_noti_max_threshold_km || 0);
    if (data.used_km) this.used_km = Number(data.used_km || 0);
    if (data.used_hours) this.used_hours = Number(data.used_hours || 0);
    if (data.last_usage_caclulated_at) this.last_usage_caclulated_at = makeString(data.last_usage_caclulated_at);
  }
  getFields() {
    return Object.keys(this).join(", ");
  }
  getValues() {
    return Object.values(this).join(", ");
  }
}
module.exports = TyreTemplate;

function makeString(value) {
  return `'${String(value.trim() || "")}'`;
}
