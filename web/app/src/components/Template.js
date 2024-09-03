import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { forwardRef, useImperativeHandle } from "react";
import { useRef } from "react";

const Template = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    refreshCountBill() {
      if (templateRef.current) {
        templateRef.current.refreshCountBill();
      }
    },
  }));

  const templateRef = useRef();

  return (
    <>
      <div className="wrapper">
        <Navbar />
        <Sidebar ref={templateRef} />

        <div class="content-wrapper pt-3">
          <section class="content">{props.children}</section>
        </div>
      </div>
    </>
  );
});

export default Template;
