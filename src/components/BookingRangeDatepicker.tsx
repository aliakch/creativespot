import { Accordion, AccordionTab } from "primereact/accordion";
import { Calendar } from "primereact/calendar";
import { useState } from "react";

import CsButton from "@/components/CsButton";

const BookingRangeDatepicker = ({
  onSubmit,
}: {
  onSubmit: (dateFrom: Date, dateTwo: Date) => void;
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const handleSubmit = () => {
    if (startDate && endDate) {
      onSubmit(startDate, endDate);
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };
  return (
    <Accordion>
      <AccordionTab header="Добавить новый временной интервал">
        <div>
          <div className="flex flex-wrap gap-x-2">
            <div className="flex flex-wrap items-center gap-2">
              <p>От</p>
              <Calendar
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.value);
                }}
                placeholder="Дата начала"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <p>До</p>
              <Calendar
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.value);
                }}
                placeholder="Дата окончания"
              />
            </div>
          </div>
          <CsButton
            className="mt-4"
            onClick={handleSubmit}
            type="button"
            rounded
          >
            Добавить интервал
          </CsButton>
        </div>
      </AccordionTab>
    </Accordion>
  );
};

export { BookingRangeDatepicker };
