import React, { Component } from "react";
import { connect } from "react-redux";
import { getHomeWorkFolder } from "../../actions";
import moment from "moment";
import keys from "../../../config/keys";
import FileViewer from "react-file-viewer";

class StudentDisplayFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayTreeRoot: [],
      breadCrum: [],
      gridView: true,
      arrayTree: [],
    };
  }

  async componentDidMount(props) {
    await this.props.getHomeWorkFolder();

 
    this.setState({
      arrayTree: this.props.getHomeWorkFolderReducer,
      arrayTreeRoot: this.props.getHomeWorkFolderReducer,
    });
  }

  getFoldersFilesCount_1(item) {
    // let folders = item.children?.filter((x) => x.type === "FOLDER");
    let files = item.children?.filter((x) => x.type === "FILE");

    return { files };
  }

  getExtensionImage = (extension) => {
    if (extension.includes("doc")) {
      return require("../../../img/word.png");
    } else if (extension.includes("xls")) {
      return require("../../../img/excel.png");
    } else if (extension.includes("ppt")) {
      return require("../../../img/powerpoint.png");
    } else if (extension.includes("pdf")) {
      return require("../../../img/pdf.png");
    } else if (extension.includes(["mp4", "3gp"])) {
      return require("../../../img/video-camera.png");
    } else if (extension.includes(["jpg", "jpeg", "bmp", "gif", "png"])) {
      return require("../../../img/picture.png");
    } else return require("../../../img/files.png");
  };

  folderClick_1(item) {
    if (item.type === "FOLDER") {
      let _breadcrum = item.SubjectName.split(" > ");
      this.setState({
        arrayTree: item.children,
        breadCrum: _breadcrum,
      });
    } else {
      this.setState({
        extension: item.extension,
        file: `${keys.ServicePath}${item.file_location}`,
        preview:true
      });
    }
  }

  breadCrumClick(id) {
    let _tmp = this.state.arrayTreeRoot.filter(
      (x) => x.homework_id === parseInt(id)
    );
    let _breadcrum = _tmp[0].path.split(" > ");
    this.setState({ arrayTree: _tmp, breadCrum: _breadcrum });
  }
  render() {
    return (
      <div>
        <h3 className="page-head-title">Files </h3>
        <div className="row form_cover">
          <div className="col-md-12 col-xl-6 col-lg-6 col-sm-12">
            <div className="row">
              <div className="col-md-12">
                {/* bread-crumb  start*/}
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-1">
                    <li className={`breadcrumb-item`}>
                      <a
                        href="javascript:void(0);"
                        onClick={() =>
                          this.setState((prev) => ({
                            arrayTree: prev.arrayTreeRoot,
                            breadCrum: [],
                            preview:false
                          }))
                        }
                      >
                        <i className="fa fa-home" aria-hidden="true" />
                      </a>
                    </li>
                    {this.state.breadCrum.map((item, index) => {
                      let _bcDet = item.split("-");

                      return (
                        <li
                          key={index}
                          className={`breadcrumb-item ${
                            _bcDet.length > 1 ? "" : "active"
                          }`}
                          onClick={() =>
                            _bcDet.length > 1
                              ? this.breadCrumClick(_bcDet[0])
                              : null
                          }
                          aria-hidden="true"
                        >
                          <a href="javascript:void(0);">
                            <i
                              className={`fa ${
                                _bcDet.length > 1
                                  ? `fa-folder`
                                  : `fa-folder-open`
                              }`}
                            ></i>
                            {` ${_bcDet.length > 1 ? _bcDet[1] : _bcDet[0]}`}
                          </a>
                        </li>
                      );
                    })}
                  </ol>
                </nav>
                {/* bread-crumb  start*/}
              </div>

              {/* view buttons start*/}
              <div className="col-md-12 mb-2">
                <button
                  className={`btn btn-sm ${
                    this.state.gridView ? "btn-primary" : "btn-light"
                  }`}
                  onClick={() => this.setState({ gridView: true })}
                >
                  <i className="fa fa-th" aria-hidden="true"></i>
                </button>
                <button
                  className={`btn btn-sm ${
                    !this.state.gridView ? "btn-primary" : "btn-light"
                  }`}
                  onClick={() => this.setState({ gridView: false })}
                >
                  <i className="fa fa-list" aria-hidden="true"></i>
                </button>
              </div>
            </div>{" "}
            {/* view buttons end*/}
            {/* main folders list start grid view */}
            {this.state.gridView && (
              <div className="row">
                {this.state.arrayTree?.map((item, index) => {
                  const { files } = this.getFoldersFilesCount_1(item);
                

                  return (
                    <div className="col-md-3 col-lg-3 col-sm-6" key={index}>
                      <div
                        className={`card ${
                          item.type !== "FOLDER" &&
                          moment(item.ToDate).format("DD/MM/YYYY") <
                            this.state.checkDate
                            ? `text-white bg-danger`
                            : ``
                        }`}
                        onClick={() => this.folderClick_1(item)}
                      >
                        {/* {moment(item.ToDate).format("DD/MM/YYYY") <
                          this.state.checkDate && (
                          <div class="card-header">Expired</div>
                        )} */}
                        {item.type === "FOLDER" && (
                          <>
                            <img
                              className="card-img-top"
                              src={require("../../../img/Documents.ico")}
                              alt="Card image cap"
                              style={{ width: 75 }}
                            />
                            <div className="card-body">
                              <h5 className="card-title font-weight-normal">
                                {item.SubjectName}
                              </h5>
                              <div className="d-flex flex-column">
                                <small className="text-muted">{`${files?.length} File(s)`}</small>
                              </div>
                            </div>
                          </>
                        )}
                        {item.type === "FILE" && (
                          <>
                            <img
                              className="card-img-top"
                              src={this.getExtensionImage(item.extension)}
                              alt="Card image cap"
                              style={{ width: 75 }}
                            />

                            <div className="card-body">
                              <small
                                className="card-title"
                                style={{ fontSize: 13, fontWeight: "normal" }}
                              >
                                {item.fileName}
                              </small>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}{" "}
            {/* main folders list end grid view */}
            {!this.state.gridView && (
              <div className="row">
                <div className="col-md-12 col-lg-12 col-sm-12">
                  <ul className="list-group list-group-flush">
                    {this.state.arrayTree.map((item, index) => {
                      const { files } = this.getFoldersFilesCount_1(item);
                      return (
                        <li
                          key={index}
                          className="list-group-item list-group-item-action p-0"
                          onClick={() => this.folderClick_1(item)}
                        >
                          {item.type === "FOLDER" && (
                            <div className="d-flex flex-row bd-highlight">
                              <div className="pt-2 bd-highlight">
                                {" "}
                                <img
                                  //className="card-img-top"
                                  src={require("../../../img/Documents.ico")}
                                  alt="Card image cap"
                                  style={{ width: 50 }}
                                />
                              </div>
                              <div className="p-2 bd-highlight">
                                <div className="d-flex flex-column line-height-12">
                                  <h5 className="card-title font-weight-normal">
                                    {item.SubjectName}
                                  </h5>

                                  <small
                                    className="text-muted"
                                    // className={"font-9"}
                                  >{`${files?.length} File(s)`}</small>
                                </div>
                              </div>
                            </div>
                          )}
                          {item.type === "FILE" && (
                            <div className="d-flex flex-row bd-highlight">
                              <div className="p-2 bd-highlight">
                                <img
                                  //className="card-img-top"
                                  src={this.getExtensionImage(item.extension)}
                                  alt="Card image cap"
                                  style={{ width: 35 }}
                                />
                              </div>
                              <div className="p-2 bd-highlight">
                                <small className="card-title font-weight-normal">
                                  {item.fileName}
                                </small>
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
          {this.state.file && this.state.preview &&(
            <div className="col-md-12 col-xl-6 col-lg-6 col-sm-12">
              <div className="border border-dark rounded">
                <div className="d-flex flex-row-reverse bd-highlight">
                  <div className="p-2 bd-highlight">
                    <a href={this.state.file} className="p-2">
                      <i className="fa fa-download" aria-hidden="true"></i>
                    </a>
                    <a
                      className="p-2"
                      href="javascript:void(0);"
                      onClick={() => this.setState({ preview: false })}
                    >
                      <i className="fa fa-times" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>
                <FileViewer
                  fileType={this.state.extension}
                  filePath={this.state.file}
                 
                  
                />

                
                {/* <DocViewer documents={this.state.file} /> */}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps({
  auth,
  client: {
    master: { common },
    globalData: { systemConfig },
    subjectAllotment: { configSubjectAgainstComb },
    document: { getHomeWorkFolderReducer },
    userControls: { acCombinationDetail },
    update,
    ui,
  },
}) {
  return {
    auth,
    update,
    ui,
    common,
    systemConfig,
    configSubjectAgainstComb,

    acCombinationDetail,
    getHomeWorkFolderReducer,
  };
}

export default connect(mapStateToProps, { getHomeWorkFolder })(
  StudentDisplayFolder
);
