import { Box, RadioGroup as ChakraRadioGroup } from "@chakra-ui/react";
import * as React from "react";

export interface RadioProps extends ChakraRadioGroup.ItemProps {
  rootRef?: React.Ref<HTMLDivElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  function Radio(props, ref) {
    const { children, inputProps, rootRef, ...rest } = props;
    return (
      <ChakraRadioGroup.Item ref={rootRef} {...rest}>
        <ChakraRadioGroup.ItemHiddenInput className="peer" ref={ref} {...inputProps} />
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          width={"42px"}
          height={"42px"}
          backgroundColor="rgba(138, 183, 185, 0.5)"
          borderRadius={"100%"}
          _peerChecked={{
            border: "2px solid #5C7E5E"
          }}
        >
          {children && children}
        </Box>
      </ChakraRadioGroup.Item>
    );
  }
);

export const RadioGroup = ChakraRadioGroup.Root;
