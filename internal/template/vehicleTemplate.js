class VehicleTemplate {
  constructor(data = {}) {
    if (data.create_time) this.create_time = makeString(data.create_time);
    if (data.update_time) this.update_time = makeString(data.update_time);
    if (data.created_by) this.created_by = makeString(data.created_by);
    if (data.last_updated_by) this.last_updated_by = makeString(data.last_updated_by);
    if (data.deleted_by) this.deleted_by = makeString(data.deleted_by);
    if (data.deleted_at) this.deleted_at = makeString(data.deleted_at);

    if (data.id) this.id = makeString(data.id);
    if (data.vehicle_type_id) this.vehicle_type_id = makeString(data.vehicle_type_id);
    if (data.vehicle_tyre_map_id) this.vehicle_tyre_map_id = makeString(data.vehicle_tyre_map_id);
    if (data.name) this.name = makeString(data.name);
    if (data.brand) this.brand = makeString(data.brand);
    if (data.model) this.model = makeString(data.model);
    if (data.build_date) this.build_date = makeString(data.build_date);
    if (data.wheel_count) this.wheel_count = Number(data.wheel_count || 0);
    if (data.origin) this.origin = makeString(data.origin);
    if (data.gps_key) this.gps_key = makeString(data.gps_key);
    if (data.tyre_rotation_max_threshold_km) this.tyre_rotation_max_threshold_km = Number(data.tyre_rotation_max_threshold_km || 0);
    this.is_trailer = Boolean(data.is_trailer);
  }
  getFields() {
    return Object.keys(this).join(", ");
  }
  getValues() {
    return Object.values(this).join(", ");
  }
}
module.exports = VehicleTemplate;

function makeString(value) {
  return `'${String(value.trim() || "")}'`;
}
