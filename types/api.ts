import { UUID } from "crypto";

export interface ChartsWithProgressResponse {
    chart_id : UUID;
    range_type: string
    progress_name: string
    progress_data: ProgressData[]
    chart_color: string
}

export interface ProgressData {
    progress_id : UUID;
    progress_value: number;
    range_value: string;
}