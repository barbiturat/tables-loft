import * as React from 'react';

import {AnyDict} from '../interfaces/index';
import Table from './table';

export default class TablesGroup extends React.Component<AnyDict, AnyDict> {
  render() {
    return (
      <div className="tables-set">

        <Table />
        <Table status="disabled" />
        <Table status="active" />
        <Table />

        <div className="table table_type_pool table_status_ready tables-set_adjust_table">
          <div className="table__label table__label_role_table-type">Pool Table 1</div>
          <a href="" className="table__button table__button_role_change-availability"/>
          <div className="table__label table__label_role_availability">
            Available
          </div>
          <div className="table__session-info">
            <span className="table__session-name">Last Session</span>
            <span className="table__session-finish-time">20:30</span>
            <span className="table__session-length">1h 10m</span>
          </div>
          <a href="" className="table__btn-view-sessions">View More</a>
        </div>

        <div className="table table_type_pool table_status_disabled tables-set_adjust_table">
            <span className="table__label table__label_role_disabled">
              Pool Table 2 Is Not Active
            </span>
          <div className="table__label table__label_role_table-type">Pool Table 1</div>
          <a href="" className="table__button table__button_role_change-availability"/>
          <div className="table__label table__label_role_availability">
            Available
          </div>
          <div className="table__session-info">
            <span className="table__session-name">Last Session</span>
            <span className="table__session-finish-time">20:30</span>
            <span className="table__session-length">1h 10m</span>
          </div>
          <a href="" className="table__btn-view-sessions">View More</a>
        </div>

        <div className="table table_type_tennis table_status_ready tables-set_adjust_table">
          <div className="table__label table__label_role_table-type">Tennis Table 3</div>
          <a href="" className="table__button table__button_role_change-availability"/>
          <div className="table__label table__label_role_availability">
            Available
          </div>
          <div className="table__session-info table__session-info_type_no-sessions">
            <div className="table__label table__label_role_no-session">No Sessions Today</div>
          </div>
        </div>

        <div className="table table_type_tennis table_status_active tables-set_adjust_table">
          <div className="table__label table__label_role_table-type">Tennis Table 3</div>
          <div className="table__label table__label_role_start-time">20:30</div>
          <a href="" className="table__button table__button_role_change-availability"/>
          <div className="table__label table__label_role_counter">
            1h 30m 16s
          </div>
          <div className="table__session-info">
            <span className="table__session-name">Last Session</span>
            <span className="table__session-finish-time">20:30</span>
            <span className="table__session-length">1h 10m</span>
          </div>
          <a href="" className="table__btn-view-sessions">View More</a>
        </div>

        <div className="table table_type_pool table_status_ready tables-set_adjust_table">
          <div className="table__label table__label_role_table-type">Pool Table 1</div>
          <a href="" className="table__button table__button_role_change-availability"/>
          <div className="table__label table__label_role_availability">
            Available
          </div>
          <div className="table__session-info">
            <span className="table__session-name">Last Session</span>
            <span className="table__session-finish-time">20:30</span>
            <span className="table__session-length">1h 10m</span>
          </div>
          <a href="" className="table__btn-view-sessions">View More</a>
        </div>

        <div className="table table_type_pool table_status_active tables-set_adjust_table">
          <div className="table__label table__label_role_table-type">Tennis Table 3</div>
          <div className="table__label table__label_role_start-time">20:30</div>
          <a href="" className="table__button table__button_role_change-availability"/>
          <div className="table__label table__label_role_counter">
            1h 30m 16s
          </div>
          <div className="table__session-info">
            <span className="table__session-name">Last Session</span>
            <span className="table__session-finish-time">20:30</span>
            <span className="table__session-length">1h 10m</span>
          </div>
          <a href="" className="table__btn-view-sessions">View More</a>
        </div>

        <div className="table table_type_default table_status_ready tables-set_adjust_table">
          <div className="table__label table__label_role_table-type">Default Table</div>
          <a href="" className="table__button table__button_role_change-availability"/>
          <div className="table__label table__label_role_availability">
            Available
          </div>
          <div className="table__session-info">
            <span className="table__session-name">Last Session</span>
            <span className="table__session-finish-time">20:30</span>
            <span className="table__session-length">1h 10m</span>
          </div>
          <a href="" className="table__btn-view-sessions">View More</a>
        </div>

        <div className="table table_type_default table_status_active tables-set_adjust_table">
          <div className="table__label table__label_role_table-type">Tennis Table 3</div>
          <div className="table__label table__label_role_start-time">20:30</div>
          <a href="" className="table__button table__button_role_change-availability"/>
          <div className="table__label table__label_role_counter">
            1h 30m 16s
          </div>
          <div className="table__session-info">
            <span className="table__session-name">Last Session</span>
            <span className="table__session-finish-time">20:30</span>
            <span className="table__session-length">1h 10m</span>
          </div>
          <a href="" className="table__btn-view-sessions">View More</a>
        </div>

        <div className="table table_type_tennis table_status_disabled tables-set_adjust_table">
          <span className="table__label table__label_role_disabled">
            Pool Table 2 Is Not Active
          </span>
          <div className="table__label table__label_role_table-type">Tennis Table 1</div>
          <a href="" className="table__button table__button_role_change-availability"/>
          <div className="table__label table__label_role_availability">
            Available
          </div>
          <div className="table__session-info">
            <span className="table__session-name">Last Session</span>
            <span className="table__session-finish-time">20:30</span>
            <span className="table__session-length">1h 10m</span>
          </div>
          <a href="" className="table__btn-view-sessions">View More</a>
        </div>

        <div className="table table_type_default table_status_disabled tables-set_adjust_table">
          <span className="table__label table__label_role_disabled">
            Pool Table 2 Is Not Active
          </span>
          <div className="table__label table__label_role_table-type">Default Table 1</div>
          <a href="" className="table__button table__button_role_change-availability"/>
          <div className="table__label table__label_role_availability">
            Available
          </div>
          <div className="table__session-info">
            <span className="table__session-name">Last Session</span>
            <span className="table__session-finish-time">20:30</span>
            <span className="table__session-length">1h 10m</span>
          </div>
          <a href="" className="table__btn-view-sessions">View More</a>
        </div>

        <div className="table table_type_shuffle table_status_ready tables-set_adjust_table">
          <div className="table__label table__label_role_table-type">Shuffle Board 5</div>
          <a href="" className="table__button table__button_role_change-availability"/>
          <div className="table__label table__label_role_availability">
            Available
          </div>
          <div className="table__session-info">
            <span className="table__session-name">Last Session</span>
            <span className="table__session-finish-time">20:30</span>
            <span className="table__session-length">1h 10m</span>
          </div>
          <a href="" className="table__btn-view-sessions">View More</a>
        </div>

        <div className="table table_type_shuffle table_status_active tables-set_adjust_table">
          <div className="table__label table__label_role_table-type">Shuffle Board 6</div>
          <div className="table__label table__label_role_start-time">20:30</div>
          <a href="" className="table__button table__button_role_change-availability"/>
          <div className="table__label table__label_role_counter">
            1h 30m 16s
          </div>
          <div className="table__session-info">
            <span className="table__session-name">Last Session</span>
            <span className="table__session-finish-time">20:30</span>
            <span className="table__session-length">1h 10m</span>
          </div>
          <a href="" className="table__btn-view-sessions">View More</a>
        </div>

        <div className="table table_type_shuffle table_status_disabled tables-set_adjust_table">
            <span className="table__label table__label_role_disabled">
              Pool Table 2 Is Not Active
            </span>
          <div className="table__label table__label_role_table-type">Shuffle Board 5</div>
          <a href="" className="table__button table__button_role_change-availability"/>
          <div className="table__label table__label_role_availability">
            Available
          </div>
          <div className="table__session-info">
            <span className="table__session-name">Last Session</span>
            <span className="table__session-finish-time">20:30</span>
            <span className="table__session-length">1h 10m</span>
          </div>
          <a href="" className="table__btn-view-sessions">View More</a>
        </div>

      </div>
    );
  }
}
