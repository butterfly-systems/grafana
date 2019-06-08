import React, { Component } from 'react';
import { TimeRange, TimeOption } from '../../types/time';

import { TimePickerCalendar } from './TimePickerCalendar';
import { TimePickerInput } from './TimePickerInput';
import { mapTimeOptionToTimeRange } from './time';
import { Timezone } from '../../utils/datemath';
import { DateTime } from '../../utils/moment_wrapper';

export interface Props {
  value: TimeRange;
  isTimezoneUtc: boolean;
  timezone?: Timezone;
  onChange?: (timeRange: TimeRange) => void;
}

export interface State {
  value: TimeRange;
  isFromInputValid: boolean;
  isToInputValid: boolean;
}

export class TimePickerPopover extends Component<Props, State> {
  static popoverClassName = 'time-picker-popover';
  constructor(props: Props) {
    super(props);
    this.state = { value: props.value, isFromInputValid: true, isToInputValid: true };
  }

  onFromInputChanged = (value: string, valid: boolean) => {
    this.setState({
      value: { ...this.state.value, raw: { ...this.state.value.raw, from: value } },
      isFromInputValid: valid,
    });
  };

  onToInputChanged = (value: string, valid: boolean) => {
    this.setState({
      value: { ...this.state.value, raw: { ...this.state.value.raw, to: value } },
      isToInputValid: valid,
    });
  };

  onFromCalendarChanged = (value: DateTime) => {
    this.setState({
      value: { ...this.state.value, raw: { ...this.state.value.raw, from: value } },
    });
  };

  onToCalendarChanged = (value: DateTime) => {
    this.setState({
      value: { ...this.state.value, raw: { ...this.state.value.raw, to: value } },
    });
  };

  onTimeOptionClick = (timeOption: TimeOption) => {
    const { isTimezoneUtc, timezone, onChange } = this.props;

    if (onChange) {
      onChange(mapTimeOptionToTimeRange(timeOption, isTimezoneUtc, timezone));
    }
  };

  onApplyClick = () => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(this.state.value);
    }
  };

  render() {
    const { isTimezoneUtc, timezone } = this.props;
    const { isFromInputValid, isToInputValid, value } = this.state;
    const isValid = isFromInputValid && isToInputValid;

    return (
      <div className={TimePickerPopover.popoverClassName}>
        <div className="time-picker-popover-body">
          <div className="time-picker-popover-body-custom-ranges">
            <div className="time-picker-popover-body-custom-ranges-input">
              <span className="time-picker-popover-custom-range-label">From</span>
              <TimePickerInput
                isTimezoneUtc={isTimezoneUtc}
                roundup={false}
                timezone={timezone}
                value={value.raw.from}
                onChange={this.onFromInputChanged}
                tabIndex={1}
              />
            </div>
            <div className="time-picker-popover-body-custom-ranges-calendar">
              <TimePickerCalendar
                isTimezoneUtc={isTimezoneUtc}
                roundup={false}
                timezone={timezone}
                value={value.raw.from}
                onChange={this.onFromCalendarChanged}
              />
            </div>
          </div>
          <div className="time-picker-popover-body-custom-ranges">
            <div className="time-picker-popover-body-custom-ranges-input">
              <span className="time-picker-popover-custom-range-label">To</span>
              <TimePickerInput
                isTimezoneUtc={isTimezoneUtc}
                roundup={true}
                timezone={timezone}
                value={value.raw.to}
                onChange={this.onToInputChanged}
                tabIndex={2}
              />
            </div>
            <div className="time-picker-popover-body-custom-ranges-calendar">
              <TimePickerCalendar
                isTimezoneUtc={isTimezoneUtc}
                roundup={true}
                timezone={timezone}
                value={value.raw.to}
                onChange={this.onToCalendarChanged}
              />
            </div>
          </div>
        </div>
        <div className="time-picker-popover-footer">
          <button type="submit" className="btn btn-success" disabled={!isValid} onClick={this.onApplyClick}>
            Apply
          </button>
        </div>
      </div>
    );
  }
}
