import * as React from "react";
import { Icon } from "./Icon";
import "./IconList.css";
import { findSVGsInReactPackage } from "../api/fetchicons";
import { addNewUpdated, sanitizeFileNames } from "../util/helpers";

export interface IconListProps {
  urls: any[];
  files: any;
}

export const IconList = (props: IconListProps) => {
  let changedFileNames = sanitizeFileNames(props.files);
  let [fileNameTree, setFileNameTree]: any[] = React.useState({});

  React.useEffect(() => {
    async function fetchMyAPI() {
      let data = await findSVGsInReactPackage(changedFileNames);

      for (var i = 0; i < data.length; i++) {
        if (data[i]) {
          changedFileNames[i].status = "updated";
          changedFileNames[i].component = data[i].module;
          changedFileNames[i].reactComponentName = data[i].name;
        } else {
          changedFileNames[i].status = "new";
        }
      }
      setFileNameTree(addNewUpdated(changedFileNames, props.urls));
    }

    fetchMyAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(props.urls)]);

  let gridHeader = () => {
    return (
      <div className="row headerRow">
        <div className="col">ICON NAME</div>
        <div className="col">SIZE</div>
        <div className="col">REGULAR</div>
        <div className="col">FILLED</div>
        <div className="col">DIFFERENCE</div>
        <div className="col"></div>
      </div>
    );
  };
  return (
    <div className="container main">
      {props.files.length > 0 && gridHeader()}

      {Object.keys(fileNameTree).map((iconName: any, index: number) => {
        if (
          iconName.includes("_new") ||
          iconName === "text direction horizontal left"
        ) {
          return <div></div>;
        }

        let regularIcon = "";
        let filledIcon = "";

        let typesAndSizes: any[] = [];
        let sizeKeys = Object.keys(fileNameTree[iconName]);
        sizeKeys.map((size) => {
          typesAndSizes.push(...fileNameTree[iconName][size]);
        });

        for (let i = typesAndSizes.length - 1; i >= 0; i--) {
          if (typesAndSizes[i].style === "regular" && !regularIcon) {
            regularIcon = typesAndSizes[i].urlPath;
          }
          if (typesAndSizes[i].style === "filled" && !filledIcon)
            filledIcon = typesAndSizes[i].urlPath;
        }

        let previousSVGRegular = <></>;
        let previousSVGFilled = <></>;

        let currentSVGRegular = "";
        let currentSVGFilled = "";

        if (
          !iconName.includes("_new") &&
          fileNameTree[iconName][`${sizeKeys[0]}`].find(
            (x: any) => x.style === "regular"
          )
        ) {
          previousSVGRegular = fileNameTree[iconName][`${sizeKeys[0]}`]
            .find((x: any) => x.style === "regular")
            .component({ title: "previousSVGRegular" });

          currentSVGRegular = fileNameTree[iconName][`${sizeKeys[0]}`].find(
            (x: any) => x.style === "regular"
          ).urlPath;
        }

        if (
          !iconName.includes("_new") &&
          fileNameTree[iconName][`${sizeKeys[0]}`].find(
            (x: any) => x.style === "filled"
          )
        ) {
          previousSVGFilled = fileNameTree[iconName][`${sizeKeys[0]}`]
            .find((x: any) => x.style === "filled")
            .component({ title: "previousSVGFilled" });

          currentSVGFilled = fileNameTree[iconName][`${sizeKeys[0]}`].find(
            (x: any) => x.style === "filled"
          ).urlPath;
        }

        return (
          <div className="row">
            <div className="col">
              {iconName.includes("_new") ? (
                <div className="newIcon">NEW</div>
              ) : (
                <div className="updatedIcon">UPDATED</div>
              )}
              <div className="iconLabel">
                {iconName.includes("_new")
                  ? iconName.replace("_new", "")
                  : iconName}
              </div>
            </div>
            <div className="col">{sizeKeys.join(", ")}</div>
            <div className="col">
              {regularIcon ? (
                <>
                  <Icon element={regularIcon} altText="" />
                  <div></div>
                </>
              ) : (
                <div className="line"></div>
              )}
            </div>
            <div className="col">
              {filledIcon ? (
                <Icon element={filledIcon} altText="" />
              ) : (
                <div className="line"></div>
              )}
            </div>

            <div className="col prevCurrentComparison">
              {!iconName.includes("new") && regularIcon ? (
                <div>
                  <div>
                    {currentSVGRegular ? (
                      <Icon
                        element={currentSVGRegular}
                        altText=""
                        isCompare={true}
                      />
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <div className="previousICONCompare">
                    {!iconName.includes("_new") ? (
                      previousSVGRegular
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="line move"></div>
              )}
            </div>
            <div className="col prevCurrentComparison ">
              {!iconName.includes("new") && filledIcon ? (
                <div>
                  <div>
                    {currentSVGFilled ? (
                      <Icon
                        element={currentSVGFilled}
                        altText=""
                        isCompare={true}
                      />
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <div className="previousICONCompare">
                    {!iconName.includes("_new") ? (
                      previousSVGFilled
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="line move"></div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
