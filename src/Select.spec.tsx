import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

import { Select } from ".";

const TEST_OPTIONS = [
  {
    label: "String 1 label",
    value: "string1",
  },
  {
    label: "String 2 label",
    value: "string2",
  },
  {
    label: "String 3 label",
    value: "string3",
  },
  {
    label: "String 4 label",
    value: "string4",
  },
  {
    label: "String 5 label",
    value: "string5",
  },
  {
    label: "String 6 label",
    value: "string6",
  },
  {
    label: "String 7 label",
    value: "string7",
  },
  {
    label: "String 8 label",
    value: "string8",
  },
  {
    label: "String 9 label",
    value: "string9",
  },
  {
    label: "String 10 label",
    value: "string10",
  },
];

describe("ref", () => {
  it("Pass correct ref", () => {
    const ref = React.createRef<HTMLSelectElement>();

    render(
      <Select
        data-testid="select"
        name="test_name"
        options={TEST_OPTIONS}
        ref={ref}
      />
    );

    expect(ref.current?.name).toEqual("test_name");
  });
});

describe("classNames", () => {
  it("has basic className", () => {
    const { getByTestId } = render(
      <Select data-testid="select" options={TEST_OPTIONS} />
    );

    expect(getByTestId("select--wrapper")).toHaveClass("select");
  });

  it("has special className when is open", async () => {
    const { getByTestId, findByTestId } = render(
      <Select data-testid="select" options={TEST_OPTIONS} />
    );

    fireEvent.click(getByTestId("select--value"));

    expect(await findByTestId("select--wrapper")).toHaveClass("select--opened");
  });

  it("has special className when disabled", () => {
    const { getByTestId } = render(
      <Select data-testid="select" disabled={true} options={TEST_OPTIONS} />
    );

    expect(getByTestId("select--wrapper")).toHaveClass("select--disabled");
  });

  it("has special className when multiple", () => {
    const { getByTestId } = render(
      <Select data-testid="select" multiple={true} options={TEST_OPTIONS} />
    );

    expect(getByTestId("select--wrapper")).toHaveClass("select--multiple");
  });

  it("has special className when invalidated", () => {
    const { getByTestId } = render(
      <Select
        data-testid="select"
        errorText="Error test"
        options={TEST_OPTIONS}
      />
    );

    expect(getByTestId("select--wrapper")).toHaveClass("select--error");
  });

  it("can set custom className", () => {
    const { getByTestId } = render(
      <Select
        data-testid="select"
        className="test_classname"
        options={TEST_OPTIONS}
      />
    );

    expect(getByTestId("select--wrapper")).toHaveClass("test_classname");
  });
});

describe("open dropdown", () => {
  it("open dropdown with click on element", async () => {
    const { getByTestId, findByTestId } = render(
      <Select data-testid="select" name="test_name" options={TEST_OPTIONS} />
    );

    fireEvent.click(getByTestId("select--value"));

    expect(await findByTestId("select--wrapper")).toHaveClass("select--opened");
  });

  it("should trigger to open dropdown in tab order", async () => {
    const { getByTestId, findByTestId } = render(
      <React.Fragment>
        <input data-testid="test_input" />

        <Select data-testid="select" options={TEST_OPTIONS} />
      </React.Fragment>
    );

    getByTestId("test_input").focus();

    userEvent.tab();

    expect(await findByTestId("select--value")).toHaveFocus();
  });

  it("should open dropdown when its label is clicked", async () => {
    const { getByRole, findByTestId } = render(
      <Select data-testid="select" label="Test label" options={TEST_OPTIONS} />
    );

    fireEvent.click(getByRole("label"));

    expect(await findByTestId("select--wrapper")).toHaveClass("select--opened");
  });
});

describe("close dropdown", () => {
  it("opened select can be closed with outside click", async () => {
    const { getByTestId, findByTestId } = render(
      <div>
        <div data-testid="test-outside" style={{ height: 100 }} />

        <Select data-testid="select" options={TEST_OPTIONS} />
      </div>
    );

    fireEvent.click(getByTestId("select--value"));
    expect(await findByTestId("select--wrapper")).toHaveClass("select--opened");

    fireEvent.click(getByTestId("test-outside"));
    expect(await findByTestId("select--wrapper")).not.toHaveClass(
      "select--opened"
    );
  });

  it("single Select - dropdown closed after select an option", async () => {
    const { getByTestId, findByTestId } = render(
      <Select data-testid="select" name="test_name" options={TEST_OPTIONS} />
    );

    fireEvent.click(getByTestId("select--value"));

    const options = (
      await findByTestId("select--dropdown")
    ).getElementsByClassName("select__option");

    fireEvent.click(options[0]);

    expect(getByTestId("select")).toHaveValue("string1");

    expect(await findByTestId("select--wrapper")).not.toHaveClass(
      "select--opened"
    );
  });

  it("multi Select - dropdown not closes after select an option", async () => {
    const { getByTestId, findByTestId } = render(
      <Select data-testid="select" multiple={true} options={TEST_OPTIONS} />
    );

    fireEvent.click(getByTestId("select--value"));

    const options = (
      await findByTestId("select--dropdown")
    ).getElementsByClassName("select__option");

    fireEvent.click(options[0]);

    expect(await findByTestId("select--wrapper")).toHaveClass("select--opened");
  });

  it("opened dropdown closes with Esc", async () => {
    const { getByTestId, container, findByTestId } = render(
      <Select data-testid="select" multiple={true} options={TEST_OPTIONS} />
    );

    fireEvent.click(getByTestId("select--value"));

    expect(await findByTestId("select--wrapper")).toHaveClass("select--opened");

    fireEvent.keyUp(container, {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      charCode: 27,
    });

    expect(await findByTestId("select--wrapper")).not.toHaveClass(
      "select--opened"
    );
  });
});

describe("search", () => {
  it("clicking on allowSearch={true} cause focus on input", async () => {
    const { getByTestId, findByTestId } = render(
      <Select data-testid="select" allowSearch={true} options={TEST_OPTIONS} />
    );

    fireEvent.focus(
      getByTestId("select--wrapper").getElementsByClassName("select__search")[0]
    );

    expect(await findByTestId("select--wrapper")).toHaveClass("select--opened");
  });
});

describe("nulls check", () => {
  it("correct renders without options props", () => {
    const { getByTestId } = render(
      <Select data-testid="select" allowSearch={true} />
    );

    expect(getByTestId("select--wrapper")).toHaveClass("select");
  });

  it("correct renders with no options", () => {
    const { getByTestId } = render(
      <Select data-testid="select" allowSearch={true} options={[]} />
    );

    expect(getByTestId("select--wrapper")).toHaveClass("select");
  });

  it("correct renders with undefined option label", async () => {
    const { getByTestId, findByTestId } = render(
      <Select
        data-testid="select"
        allowSearch={true}
        options={[
          {
            label: undefined,
            value: "string1",
          },
        ]}
      />
    );

    fireEvent.focus(
      getByTestId("select--wrapper").getElementsByClassName("select__search")[0]
    );

    expect(
      (await findByTestId("select--dropdown")).getElementsByClassName(
        "select__option"
      )[0]
    ).toHaveTextContent("string1");
  });

  it("correct renders with undefined option value", async () => {
    const { getByTestId, findByTestId } = render(
      <Select
        data-testid="select"
        allowSearch={true}
        options={[
          {
            component: null,
            label: "test_label",
            value: undefined,
          },
        ]}
      />
    );

    fireEvent.focus(
      getByTestId("select--wrapper").getElementsByClassName("select__search")[0]
    );

    expect(
      (await findByTestId("select--dropdown")).getElementsByClassName(
        "select__option"
      )[0]
    ).toHaveTextContent("test_label");
  });

  it("correct renders with null option component", async () => {
    const { getByTestId, findByTestId } = render(
      <Select
        data-testid="select"
        allowSearch={true}
        options={[
          {
            component: null,
            label: "test_label",
            value: "string1",
          },
        ]}
      />
    );

    fireEvent.focus(
      getByTestId("select--wrapper").getElementsByClassName("select__search")[0]
    );

    expect(
      (await findByTestId("select--dropdown")).getElementsByClassName(
        "select__option"
      )[0]
    ).toHaveTextContent("test_label");
  });
});

describe("props check", () => {
  it("should have aria-* attributes", () => {
    const { getByTestId } = render(
      <Select data-testid="select" options={TEST_OPTIONS} aria-hidden="true" />
    );

    expect(getByTestId("select")).toHaveAttribute("aria-hidden", "true");
  });

  it("should have data-* attributes", () => {
    const { getByTestId } = render(
      <Select data-testid="select" options={TEST_OPTIONS} data-custom="test" />
    );

    expect(getByTestId("select")).toHaveAttribute("data-custom", "test");
  });

  it("single - should apply value to select tag", () => {
    const val = TEST_OPTIONS[1].value;

    const { getByTestId } = render(
      <Select data-testid="select" value={val} options={TEST_OPTIONS} />
    );

    expect(getByTestId("select")).toHaveValue(val);
  });

  it("multiple - should apply value to select tag", () => {
    const val = [TEST_OPTIONS[1].value, TEST_OPTIONS[3].value];

    const { getByTestId } = render(
      <Select
        data-testid="select"
        value={val}
        multiple={true}
        options={TEST_OPTIONS}
      />
    );

    expect(getByTestId("select")).toHaveValue(val);
  });

  it("should not trigger any event with disabled", () => {
    const { getByTestId } = render(
      <Select data-testid="select" disabled={true} options={TEST_OPTIONS} />
    );

    fireEvent.click(getByTestId("select--value"));

    expect(getByTestId("select--wrapper")).not.toHaveClass("select--opened");
  });

  it("should display the placeholder if its value is empty", () => {
    const placeholder = "Test placeholder";

    const { getByTestId } = render(
      <Select
        data-testid="select"
        placeholder={placeholder}
        options={TEST_OPTIONS}
      />
    );

    expect(getByTestId("select--value")).toHaveTextContent(placeholder);
  });
});

describe("onChange", () => {
  it("single select - should get selected value", async () => {
    let val = "";

    const onChange = jest.fn((event) => {
      val = event.currentTarget.value;
    });

    const { getByTestId, container, findByTestId } = render(
      <Select data-testid="select" options={TEST_OPTIONS} onChange={onChange} />
    );

    fireEvent.click(getByTestId("select--value"));

    expect(await findByTestId("select--wrapper")).toHaveClass("select--opened");

    const option = container.querySelector("[role=option]:first-of-type");

    fireEvent.click(option as Element);

    expect(onChange).toHaveBeenCalledTimes(1);

    expect(val).toEqual(TEST_OPTIONS[0].value);
  });

  it("multiple select - should get selected values", async () => {
    let val: string[] = [];

    const onChange = jest.fn((values: string[]) => {
      val = values;
    });

    const { getByTestId, container, findByTestId } = render(
      <Select
        multiple
        data-testid="select"
        options={TEST_OPTIONS}
        onChange={onChange}
      />
    );

    fireEvent.click(getByTestId("select--value"));

    expect(await findByTestId("select--wrapper")).toHaveClass("select--opened");

    const option1 = container.querySelector("[role=option]:nth-child(1)");
    const option2 = container.querySelector("[role=option]:nth-child(2)");

    fireEvent.click(option1 as Element);
    fireEvent.click(option2 as Element);

    expect(onChange).toHaveBeenCalledTimes(2);

    expect(val).toEqual([TEST_OPTIONS[0].value, TEST_OPTIONS[1].value]);
  });
});

describe("visible options", () => {
  it("options should have a data-value attribute", async () => {
    const { getByTestId, findByTestId } = render(
      <Select
        data-testid="select"
        className="test_classname"
        options={TEST_OPTIONS}
      />
    );

    fireEvent.click(getByTestId("select--value"));

    const options = (
      await findByTestId("select--dropdown")
    ).getElementsByClassName("select__option");

    for (let i = 0; i < options.length; i++) {
      expect(options[i]).toHaveAttribute("data-value", TEST_OPTIONS[i].value);
    }
  });

  it("single select - option should be selected correctly", async () => {
    const val = TEST_OPTIONS[1].value;

    const { getByTestId, findByTestId } = render(
      <Select data-testid="select" value={val} options={TEST_OPTIONS} />
    );

    fireEvent.click(getByTestId("select--value"));

    const option = (
      await findByTestId("select--dropdown")
    ).getElementsByClassName("select__option--selected")[0];

    expect(option).toHaveAttribute("data-value", val);
  });

  it("multiple select - options should be selected correctly", async () => {
    const val = [TEST_OPTIONS[1].value, TEST_OPTIONS[3].value];

    const { getByTestId, findByTestId } = render(
      <Select
        data-testid="select"
        value={val}
        multiple={true}
        options={TEST_OPTIONS}
      />
    );

    fireEvent.click(getByTestId("select--value"));

    const options = (
      await findByTestId("select--dropdown")
    ).getElementsByClassName("select__option--selected");

    for (let i = 0; i < val.length; i++) {
      expect(options[i]).toHaveAttribute("data-value", val[i]);
    }
  });

  it("single select - should display selected option", () => {
    const { value, label } = TEST_OPTIONS[1];

    const { getByTestId } = render(
      <Select data-testid="select" value={value} options={TEST_OPTIONS} />
    );

    expect(getByTestId("select--value")).toHaveTextContent(label);
  });

  it("single multiple - should display selected options count", () => {
    const val = [TEST_OPTIONS[1].value, TEST_OPTIONS[3].value];

    const { getByTestId } = render(
      <Select
        data-testid="select"
        value={val}
        multiple={true}
        options={TEST_OPTIONS}
      />
    );

    expect(getByTestId("select--value")).toHaveTextContent(
      `Selected ${val.length}`
    );
  });

  it("should display the selected item even if its value is empty", () => {
    const { getByTestId } = render(
      <Select
        data-testid="select"
        value=""
        placeholder="Should not be visible"
        options={[...TEST_OPTIONS, { label: "No value", value: "" }]}
      />
    );

    expect(getByTestId("select--value")).toHaveTextContent("No value");
  });
});

describe("warnings", () => {
  const originalWarn = console.warn;
  const consoleOutput: string[] = [];
  const mockedWarn = (output: string) => consoleOutput.push(output);

  beforeEach(() => (console.warn = mockedWarn));

  afterEach(() => (console.warn = originalWarn));

  it("warns when the value is not present in any option", () => {
    const val = "ANOTHER";

    render(<Select data-testid="select" value={val} options={TEST_OPTIONS} />);

    expect(consoleOutput).toEqual([
      `artof-select: You have provided a non-exist value \`${val}\` for the select component.\n` +
        "Consider providing a value that matches one of the available options or ''.\n" +
        `The available values are ${TEST_OPTIONS.map(
          ({ value }) => `\`${value}\``
        ).join(", ")}.`,
    ]);
  });
});
