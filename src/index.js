/*eslint-disable */
const App = () => {
  const excalidrawRef = React.useRef(null);
  const excalidrawWrapperRef = React.useRef(null);
  const [dimensions, setDimensions] = React.useState({
    width: undefined,
    height: undefined
  });
  window.excalidrawRef = excalidrawRef
  window.excalidrawWrapperRef = excalidrawWrapperRef

  const [viewModeEnabled, setViewModeEnabled] = React.useState(false);
  const [zenModeEnabled, setZenModeEnabled] = React.useState(false);
  const [gridModeEnabled, setGridModeEnabled] = React.useState(false);

  React.useEffect(() => {
    setDimensions({
      width: excalidrawWrapperRef.current.getBoundingClientRect().width,
      height: excalidrawWrapperRef.current.getBoundingClientRect().height
    });
    const onResize = () => {
      setDimensions({
        width: excalidrawWrapperRef.current.getBoundingClientRect().width,
        height: excalidrawWrapperRef.current.getBoundingClientRect().height
      });
    };

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [excalidrawWrapperRef]);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      {
        className: "excalidraw-wrapper",
        ref: excalidrawWrapperRef
      },
      React.createElement(Excalidraw.default,{
        initialData: InitialData,
        // onChange: (elements, state) => console.log("Elements :", elements, "State : ", state),
        // onPointerUpdate: (payload) => console.log(payload),
        onCollabButtonClick: () => window.alert("You clicked on collab button"),
        viewModeEnabled: viewModeEnabled,
        zenModeEnabled: zenModeEnabled,
        gridModeEnabled: gridModeEnabled,
      })
    )
  );
};

const excalidrawWrapper = document.getElementById("app");

const main = async function() {
  const ubj = new URL(location.href)
  window.InitialData = await fetch(ubj.searchParams.get('src'), {json:true}).then(r=>r.json())
  ReactDOM.render(React.createElement(App), excalidrawWrapper);
}
main()
